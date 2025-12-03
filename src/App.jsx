/**
 * Main App Component
 * Orchestrates the weather application with search, favorites, and weather display
 */
import { useState, useEffect } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { LoadingScreen } from './components/LoadingScreen';
import { SearchPanel } from './components/SearchPanel';
import { WeatherDisplay } from './components/WeatherDisplay';
import { TomorrowForecast } from './components/TomorrowForecast';
import { useWeatherData } from './hooks/useWeatherData';
import { useLocalTime } from './hooks/useLocalTime';
import { getStyles } from './constants/styles';

export default function App() {
  // Search input state
  const [query, setQuery] = useState('');
  // Temperature unit (celsius/fahrenheit)
  const [unit, setUnit] = useState('c');
  // Favorites list persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Weather data and API functions from custom hook
  const {
    weather,
    loading,
    error,
    locationName,
    locationCandidates,
    fetchWeatherForCoords,
    fetchCandidates,
    fetchSingleLocation,
  } = useWeatherData();

  // Theme based on day/night from weather data
  const isDayTheme = weather?.current?.is_day === 1;
  // Local time, phase, and progress from timezone
  const { time, phase, progress } = useLocalTime(weather?.timezone);
  // Dynamic styles based on theme
  const styles = getStyles(isDayTheme);

  // Persist favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => setUnit(prev => prev === 'c' ? 'f' : 'c');

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchCandidates(query);
    }
  };

  // Select a location from search candidates
  const selectLocation = (candidate) => {
    const { latitude, longitude, name, country } = candidate;
    fetchWeatherForCoords(latitude, longitude, name, country);
    setQuery('');
  };

  // Add/remove location from favorites
  const toggleFavorite = () => {
    if (favorites.includes(locationName)) {
      setFavorites(favorites.filter(f => f !== locationName));
    } else {
      setFavorites([...favorites, locationName]);
    }
  };

  const isFavorite = favorites.includes(locationName);

  // Show loading screen on initial load
  if (loading && !weather) return <LoadingScreen />;

  return (
    <div className={`min-h-screen font-mono px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex justify-center items-stretch relative overflow-hidden transition-colors duration-1000 ${styles.wrapper}`}>
      <BackgroundVideo isDayTheme={isDayTheme} />

      {/* Dynamic Grid Background */}
      <div className={`absolute inset-0 bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-all duration-1000 ${styles.grid}`}></div>

      {/* Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow1}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow2}`}></div>

      <div className="relative w-full max-w-6xl z-10">
        {/* Logo */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6">
          <img
            src="/logo.svg"
            alt="Cloud Magazine - A Megazone Cloud Weather App"
            className={`h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 2xl:h-24 w-auto transition-all duration-1000 ${!isDayTheme ? 'brightness-0 invert saturate-150' : ''}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(0,1fr)] gap-4 sm:gap-6 md:gap-8 pt-14 sm:pt-18 md:pt-22 lg:pt-24 xl:pt-28">
          <SearchPanel
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            loading={loading}
            locationCandidates={locationCandidates}
            selectLocation={selectLocation}
            favorites={favorites}
            fetchSingleLocation={fetchSingleLocation}
            isDayTheme={isDayTheme}
            styles={styles}
          />

          <div className="md:col-span-8 flex flex-col gap-3 sm:gap-4">
            <WeatherDisplay
              weather={weather}
              error={error}
              unit={unit}
              toggleUnit={toggleUnit}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              locationName={locationName}
              time={time}
              phase={phase}
              progress={progress}
              fetchSingleLocation={fetchSingleLocation}
              isDayTheme={isDayTheme}
              styles={styles}
            />

            {weather && !error && (
              <TomorrowForecast
                weather={weather}
                unit={unit}
                isDayTheme={isDayTheme}
                styles={styles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
