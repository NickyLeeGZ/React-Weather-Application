# React Weather App

A React weather search application built with OpenWeatherMap API.

## Features

- **Live Weather Search:** Fetch weather details by city and country code via the OpenWeatherMap REST API.
- **Search History:** Tracks past searches with timestamps.
- **Session Storage Persistence:** Stores history in `sessionStorage` so data stays available across page refreshes within the same tab session.
- **Responsive Layout:** Flexbox layout supporting wrapping across different screen resolutions.

---

## Tech Stack

- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **API:** OpenWeatherMap (Current Weather Data API)
- **Styling:** CSS & Inline Styles

---

## Prerequisites

Before running the app, obtain an API key from [OpenWeatherMap API Keys Page](https://home.openweathermap.org/api_keys).

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NickyLeeGZ/React-Weather-Application
   cd <project-folder-name>
2. **Install dependencies**
   ```bash
   npm install
3. **Configure Environment Variables**

   Create a .env file in the root directory of the project:
   ```bash
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
4. **Start the development server**
   ```bash
   npm run dev