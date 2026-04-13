# 🌪️ NexusCore: Disaster + Smart Response Dashboard

NexusCore is a real-time, highly interactive frontend web application designed to evaluate live environmental risks and instantly synthesize tactical, actionable advice using lightning-fast AI inference.

This project was built from scratch leveraging pure **Vanilla CSS** to construct a highly responsive, premium glassmorphic UI.

## ✨ Out-of-the-Box Features

- **🧠 Groq AI Integration:** Feeds live meteorological data to Groq's high-performance LLM to instantly generate tactical survival analyses.
- **🛡️ Adaptive Threat Level UI:** The CSS physically alters based on the LLM's returned Risk Level. If Groq declares a Critical (Level 4) state, the dashboard pulses with red warning alerts.
- **🌍 Interactive Radar Maps:** Powered by `react-leaflet` and CartoDB styles. Features dynamic hazard radii overlays when active regional flood warnings are detected.
- **🛰️ Auto-Geolocation & Global Target Search:** Connect to browser location services for an instant local sweep, or use the built-in Geocoding search to target any city globally.
- **🔊 EMER-COMMS (Emergency Audio Broadcast):** Employs the Web Speech API to synthetically read the AI's tactical analysis out loud.
- **📡 Live HQ Transmission Ticker:** A persistent, scrolling advice marquee using the public AdviceSlip API.

## 🛠️ Technology Stack

- **Core:** React.js + Vite
- **Styling:** Vanilla CSS (Glassmorphism, custom CSS Variables, Flexbox/Grid CSS)
- **Data APIs:**
  - [Open-Meteo API](https://open-meteo.com/) (Live Weather & Forecasts)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (Location Search)
  - [UK Environment Agency Flood API](https://environment.data.gov.uk/flood-monitoring/doc/reference) (Hazard Assessment)
  - [AdviceSlip API](https://api.adviceslip.com/) (Wisdom Ticker)
- **AI Inference Engine:** Groq API (Configured via `openai` SDK)
- **Mapping:** Leaflet & `react-leaflet`

## 🚀 Setup & Installation

### 1. Clone & Install
Ensure you have Node.js installed, then navigate to this directory and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
You will need a valid **Groq API Key** to run the LLM inference engine. 
1. Open the root folder.
2. Locate the `.env.example` file and rename it to `.env` (or create a new `.env` file).
3. Paste your Groq API key:
```env
VITE_GROQ_API_KEY=your_actual_api_key_here
```

### 3. Launch Development Server
```bash
npm run dev
```
Open the `localhost` URL provided in your terminal to engage the dashboard. Click **"Execute Sweep"** to run your first tactical analysis!
