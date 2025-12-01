# CloudMagazine - Weather App

A modern, futuristic weather application built with React, Vite, and Tailwind CSS. Takes design elements from Megazone Cloud including the logo, title and day (Megazone AIR animation) and night (Cloud Native animation) backgrounds. Features real-time weather data, temperature unit toggling, favorites management, and a sleek day/night theme.

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Open-Meteo API** - Free weather data (no API key required)

## Features

- 🌍 Search weather by city name
- ⭐ Save favorite locations
- 🌡️ Toggle between Celsius and Fahrenheit
- 🌙 Automatic day/night theme switching
- 📊 Real-time weather data (temperature, humidity, wind speed, weather conditions)
- 📅 Tomorrow's forecast
- 📱 Responsive design

## Local Deployment

### Prerequisites

- Node.js 16+ and npm installed

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/prionti/PycharmProjects/WeatherApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173/`

### Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
WeatherApp/
├── src/
│   ├── App.jsx           # Main React component (weather app)
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## API

The app uses the free **Open-Meteo API** (https://open-meteo.com) for weather data:

- **Geocoding API** - Convert city names to coordinates
- **Weather Forecast API** - Get current and future weather

No API key or authentication required.

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## License

MIT
