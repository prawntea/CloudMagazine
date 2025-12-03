/**
 * useWeatherData Hook
 * Manages weather data fetching, location search, and state management
 */
import { useState, useEffect, useCallback } from 'react';

export const useWeatherData = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('New York');
  const [locationCandidates, setLocationCandidates] = useState([]);

  // Fetch weather data for specific coordinates
  const fetchWeatherForCoords = async (latitude, longitude, name, country) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]);
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      setLocationName(`${name}, ${country}`.toUpperCase());
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search for location candidates (returns multiple results)
  const fetchCandidates = async (city) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('LOCATION NOT FOUND. Try refining your search (e.g., "Paris, France").');
      }

      // Limit to top 5 results
      setLocationCandidates(geoData.results.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single location (for favorites or direct searches)
  const fetchSingleLocation = async (city) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        return await fetchCandidates(city);
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeatherForCoords(latitude, longitude, name, country);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load default location on mount
  useEffect(() => {
    fetchSingleLocation('New York');
  }, []);

  return {
    weather,
    loading,
    error,
    locationName,
    locationCandidates,
    fetchWeatherForCoords,
    fetchCandidates,
    fetchSingleLocation,
  };
};