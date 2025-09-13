/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'chart.js/auto';
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers';

import type { MarineWaveCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  MARINE-WAVE-CARD (24h rolling) \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'marine-wave-card',
  name: 'Marine Wave Card',
  description: 'Displays surf height as bars and wind gusts as arrows with 24h rolling window',
});

@customElement('marine-wave-card')
export class MarineWaveCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('marine-wave-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: MarineWaveCardConfig;
  private _chart?: Chart;

  public setConfig(config: MarineWaveCardConfig): void {
    if (!config) throw new Error(localize('common.invalid_configuration'));
    if (config.test_gui) getLovelace().setEditMode(true);
    this.config = { name: 'Marine Wave', ...config };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) return false;
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    return html`
      <ha-card header=${this.config.name || "Marine Wave"}>
        <div class="chart-container">
          <canvas id="marineWaveChart"></canvas>
        </div>
      </ha-card>
    `;
  }

  protected firstUpdated(): void {
    const ctx = this.renderRoot.querySelector("#marineWaveChart") as HTMLCanvasElement;
    if (!ctx) return;

    this._chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Surf Height (m)",
            type: "bar",
            data: [],
            backgroundColor: "rgba(0, 123, 255, 0.6)",
            borderColor: "rgba(0, 123, 255, 1)",
          },
          {
            label: "Wind Gusts (m/s)",
            type: "scatter",
            data: [],
            showLine: false,
            yAxisID: "y2",
            pointStyle: (ctx) => this._arrowPoint(ctx, "black"),
            pointRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (item) => {
                if (item.dataset.label?.includes("Wind")) {
                  return `Wind ${item.raw.speed} m/s dir ${item.raw.angle}°`;
                }
                return `${item.raw} m`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
              stepSize: 6,
              displayFormats: {
                hour: "HH:mm",
              },
            },
            ticks: { source: "auto" },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "Surf Height (m)" },
          },
          y2: {
            beginAtZero: true,
            position: "right",
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Wind (m/s)" },
          },
        },
      },
    });
  }

  protected updated(): void {
    if (!this._chart || !this.hass || !this.config?.entity) return;

    const stateObj = this.hass.states[this.config.entity];
    if (!stateObj) return;

    const attrs = stateObj.attributes || {};
    const swellH = parseFloat(attrs.swell_wave_height) || 0;
    const windSpeed = parseFloat(attrs.wind_wave_height) || 0; // adjust if gust attribute available
    const windDir = parseFloat(attrs.wind_wave_direction) || 0;

    const now = new Date();

    this._chart.data.labels!.push(now);
    (this._chart.data.datasets![0].data as number[]).push(swellH);
    (this._chart.data.datasets![1].data as any[]).push({ x: now, y: windSpeed, angle: windDir, speed: windSpeed });

    // Drop points older than 24h
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    while (this._chart.data.labels!.length && (this._chart.data.labels![0] as Date).getTime() < cutoff) {
      this._chart.data.labels!.shift();
      (this._chart.data.datasets![0].data as number[]).shift();
      (this._chart.data.datasets![1].data as any[]).shift();
    }

    this._chart.update();
  }

  private _arrowPoint(ctx: any, color: string): HTMLCanvasElement {
    const angle = ctx.raw?.angle || 0;
    const arrow = document.createElement("canvas");
    arrow.width = 20;
    arrow.height = 20;
    const aCtx = arrow.getContext("2d")!;
    aCtx.translate(10, 10);
    aCtx.rotate((angle * Math.PI) / 180);
    aCtx.beginPath();
    aCtx.moveTo(0, -8);
    aCtx.lineTo(5, 8);
    aCtx.lineTo(-5, 8);
    aCtx.closePath();
    aCtx.fillStyle = color;
    aCtx.fill();
    return arrow;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({ type: 'error', error, origConfig: this.config });
    return html`${errorCard}`;
  }

  static get styles(): CSSResultGroup {
    return css`
      .chart-container {
        padding: 1em;
      }
      canvas {
        width: 100% !important;
        max-height: 300px;
      }
    `;
  }
}
