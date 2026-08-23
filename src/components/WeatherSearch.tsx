import { useEffect, useState } from 'react';
import { SearchForm } from './SearchForm';
import type { SearchHistoryEntry } from '../types/SearchHistory';
import type { WeatherInfo } from '../types/weather';

const initialWeatherInfo = {
    city: '',
    country: '',
    mainWeather: '',
    weatherDescription: '',
    humidity: 0,
    time: '',
    temperature: 0,
} as WeatherInfo;

const formatTimezone = (timezoneOffsetInSeconds: number): string => {
    const now = new Date();
    const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

    const localTimestamp = utcTimestamp + timezoneOffsetInSeconds * 1000;
    const localDate = new Date(localTimestamp);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    const dateString = `${year}-${month}-${day}`;

    const timeString = localDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return `${dateString} ${timeString}`;
};

export const WeatherSearch = () => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [weatherInfo, setWeatherInfo] = useState(initialWeatherInfo);
    const [errorMessage, setErrorMessage] = useState('');

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    useEffect(() => {
        const handleHistorySearch = (event: Event) => {
            const customEvent = event as CustomEvent<{ city?: string; country?: string }>;
            const city = customEvent.detail?.city ?? '';
            const country = customEvent.detail?.country ?? '';

            if (!city || city.trim() === '') return;

            handleSearch(city, country);
            setCity(city);
            setCountry(country);
        };

        window.addEventListener('searchFromHistory', handleHistorySearch);

        return () => {
            window.removeEventListener('searchFromHistory', handleHistorySearch);
        };
    }, []);

    const handleSearch = async (
        city: string, country: string
    ) => {
        setWeatherInfo(initialWeatherInfo);
        setErrorMessage('');

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                setErrorMessage(data.message)
                return;
            }

            if (data.sys && data.sys.country) {
                setWeatherInfo({
                    city: city,
                    country: country,
                    mainWeather: data.weather[0].main,
                    weatherDescription: data.weather[0].description,
                    humidity: data.main.humidity,
                    time: formatTimezone(data.timezone),
                    temperature: data.main.temp
                })

                const newSearchEntry = { city, country, time: formatTimezone(data.timezone) };
                const searchHistoryInStorage = sessionStorage.getItem('weatherHistory');
                const savedSearchHistory = searchHistoryInStorage ? JSON.parse(searchHistoryInStorage) : [];

                const updatedSearchHistory: SearchHistoryEntry[] = [newSearchEntry, ...savedSearchHistory];

                sessionStorage.setItem('weatherHistory', JSON.stringify(updatedSearchHistory));
                window.dispatchEvent(new Event('sessionStorageUpdated'));
            }
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
        }

    };
    const handleClear = () => {
        setCity('');
        setCountry('');
        setErrorMessage('');
        setWeatherInfo(initialWeatherInfo);
        window.dispatchEvent(new Event('sessionStorageCleared'));
    };

    return (
        <>
            <div style={{ flexWrap: 'wrap', display: 'flex', gap: '20px', alignItems: 'center', padding: 10, marginTop: -30 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0 }}>City:</h2>
                    <SearchForm value={city} onChange={(value) => {
                        setCity(value);
                    }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0 }}>Country:</h2>
                    <SearchForm value={country} onChange={(value) => { setCountry(value) }} />
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="button" disabled={city.length === 0 || country.length === 0} onClick={() => handleSearch(city, country)}>
                        Search
                    </button>
                    <button type="button" onClick={handleClear}>
                        Clear
                    </button>
                </div>

            </div>

            {
                <div style={{
                    minHeight: '200px', display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', paddingLeft: 30, paddingBottom: 20
                }}>
                    {
                        weatherInfo.country &&
                        <>
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
                </div>
            }
            {
                errorMessage.length !== 0 && <h4
                    className="capitalize-first error-message-box"
                >
                    {errorMessage}
                </h4>
            }
        </>
    );
};