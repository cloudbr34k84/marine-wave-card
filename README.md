
# Marine Wave Card

A custom Lovelace card for Home Assistant that works alongside the **Open-Meteo Marine Weather integration** to visualize detailed surf and marine conditions.  

This card focuses on **wave, swell, and wind** data, giving a clear surf-report style view right inside Home Assistant.

---

## 🌊 Overview

The **Open-Meteo Marine Weather integration** fetches marine forecast and condition data from the Open-Meteo API and exposes it as Home Assistant sensors, such as:

- `swell_wave_height`
- `swell_wave_period`
- `swell_wave_direction` (+ direction text)
- `wave_height`
- `wind_speed`, `wind_gust`, `wind_direction`

While the integration provides **raw sensor values**, the Marine Wave Card turns those values into a **visual surf dashboard** with easy-to-read charts and direction arrows.  

This makes it possible to go beyond numbers and instantly see:  
- **How big the waves are**  
- **How consistent the swell is**  
- **Where the waves are coming from**  
- **What the wind is doing**

---

## 🖼️ What the Card Provides
- **Surf Height (bars):** visualizes swell/wave height as color-coded bars.  
- **Swell Period:** optional overlay line to show consistency/quality.  
- **Wind Gusts:** arrows plotted to indicate wind direction, with length/label for speed.  
- **24h Rolling History:** shows conditions across the last day, with 6-hour tick marks.  
- **Compact Surf Report Style:** similar to surf forecast websites and apps.  

---

## 🤝 How It Complements the Integration

- **Integration only:** provides **current + forecast values** as numbers and attributes.  
- **Card only:** transforms those values into **visual, interactive dashboards**.  

Together they give you:  
- The **data backend** (integration sensors).  
- The **visual frontend** (Marine Wave Card).  

This combination makes marine/surf conditions easily understandable at a glance, without having to parse raw sensor attributes.

---

## 🚀 Installation

1. **Build the card:**
   ```bash
   npm install
   npm run build
````

→ Output: `dist/marine-wave-card.js`

2. **Copy the built file into Home Assistant:**

   ```
   /config/www/marine-wave-card/marine-wave-card.js
   ```

3. **Add the resource in Home Assistant:**

   * **Settings → Dashboards → Resources → + Add Resource**
   * URL: `/local/marine-wave-card/marine-wave-card.js`
   * Type: **JavaScript Module**

   *(YAML alternative):*

   ```yaml
   lovelace:
     resources:
       - url: /local/marine-wave-card/marine-wave-card.js
         type: module
   ```

4. **Add the card to a dashboard:**

   ```yaml
   type: custom:marine-wave-card
   entity: sensor.sydney_current  # replace with your marine sensor
   name: Bondi Surf Report
   ```

5. **Refresh the HA frontend** (Ctrl+Shift+R on desktop).

---

## 📊 Example View

![Marine Wave Card Example](docs/example.png)

---

## 🔮 Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed planned features including multi-day forecast charts, tide overlays, quality ratings, and more.

