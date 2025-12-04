/*
* App Component. 
* Main application component that integrates all parts of the weather app,
* manages state, and handles user interactions.
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
  const [query, setQuery] = useState('');
  const [unit, setUnit] = useState('c');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });

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

  const isDayTheme = weather?.current?.is_day === 1;
  const { time, phase, progress } = useLocalTime(weather?.timezone);
  const styles = getStyles(isDayTheme);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = () => setUnit(prev => prev === 'c' ? 'f' : 'c');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchCandidates(query);
  };

  const selectLocation = (candidate) => {
    const { latitude, longitude, name, country } = candidate;
    fetchWeatherForCoords(latitude, longitude, name, country);
    setQuery('');
  };

  const toggleFavorite = () => {
    if (favorites.includes(locationName)) {
      setFavorites(favorites.filter(f => f !== locationName));
    } else {
      setFavorites([...favorites, locationName]);
    }
  };

  const isFavorite = favorites.includes(locationName);

  if (loading && !weather) return <LoadingScreen />;

  return (
    <div className={`min-h-screen font-mono flex flex-col relative overflow-hidden ${styles.wrapper}`} style={{ transition: 'background-color 1s ease-in-out, color 1s ease-in-out' }}>
      <BackgroundVideo isDayTheme={isDayTheme} />
      {/* CloudMagazine Logo */}
      <div
        id="logo-container"
        className="absolute top-4 left-4 z-20 flex items-start justify-start"
      >
        <img
          src="/logo.svg"
          alt="CloudMagazine - A Megazone Cloud Weather App"
          className={`w-48 sm:w-56 md:w-64 lg:w-72 h-auto transition-all duration-1000 ease-in-out ${!isDayTheme ? 'brightness-0 invert saturate-150' : ''}`}
        />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8`}
        style={{
          marginTop: document.getElementById('logo-container')?.offsetHeight || 0,
        }}
      >
        {/* Search Panel */}
        <div className="md:w-1/3 flex-shrink-0">
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
        </div>
        {/* Weather Display & Forecast */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
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
  );
}