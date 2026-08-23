import type { WeatherInfo } from "../types/weather"

export const WeatherResult = (
    weatherInfo: WeatherInfo
) => {
    return <>
        <h4 className='capitalize-first'>
            {
                weatherInfo.country.length !== 0 && `${weatherInfo.city.toLowerCase()
                }, ${weatherInfo.country}`
            }
        </h4>
        <h1 style={{
            marginTop: '-10px'
        }}>
            {weatherInfo.mainWeather}
        </h1>
        <h4 style={{ textAlign: 'left', margin: 0 }}>
            Description: {weatherInfo.weatherDescription}<br />
            Temperature: {weatherInfo.temperature}°C<br />
            Humidity: {weatherInfo.humidity}%<br />
            Time: {weatherInfo.time}
        </h4>
    </>
}