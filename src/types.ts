import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'marine-wave-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// Configuration options for the Marine Wave Card
export interface MarineWaveCardConfig extends LovelaceCardConfig {
  type: 'custom:marine-wave-card';
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
