
## 📄 `ROADMAP.md`

```markdown
# Marine Wave Card – Feature Roadmap

This document outlines planned enhancements for the Marine Wave Card.

---

## ✅ Current Features
- Bar chart for surf/swell height.
- Wind gusts plotted as directional arrows with speed values.
- Rolling 24h history with 6-hour tick labels.
- Customizable card title (`name`).
- Compatible with Home Assistant Lovelace dashboards.

---

## 🚀 Planned Enhancements

### Phase 1 – Short-Term Improvements
- **Wind speed vs gusts split:** separate datasets (solid vs dashed line).
- **Swell period overlay:** dashed line plotted on secondary y-axis.
- **Wave direction arrows:** second arrow dataset (different color).
- **Custom colors:** configuration options for swell, wave, wind.

### Phase 2 – Forecast Support
- Extend backend (`sensor.py`) to fetch **forecast arrays** (hourly/daily).
- Add card config `forecast_hours` to control look-ahead window.
- Downsample forecasts into 6h or 3h buckets.
- Support multiple swell trains (primary, secondary, tertiary).

### Phase 3 – Visualization Enhancements
- Tide curve overlay (requires tide sensor).
- Sun/moon annotations along top axis.
- Quality color bands (green/orange/red) for surf conditions.
- Multiple stacked sub-charts (waves, wind, tide).

### Phase 4 – Usability & Customization
- Configurable axis ranges and units (m, ft).
- Configurable arrow size, color, and style.
- Custom tooltips (e.g., "Swell 2.1m @ 15s from SW").
- Internationalization (i18n) strings beyond `en`/`nb`.

---

## 📅 Longer-Term Goals
- Mobile-optimized compact view.
- Comparison view (e.g., two beaches side-by-side).
- Export chart data as JSON/CSV for analysis.
- Integration with external surf forecast APIs for richer data.

---

## 💡 Contribution Ideas
- Add new language translations.
- Style improvements for chart readability.
- Sensors for tide, moon phase, or water temperature.

---
