import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Thermometer, Wind, Droplets, ArrowRight, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Moon, Radio, Clock as ClockIcon } from 'lucide-react';

// --- API Helpers ---

const getWeatherDescription = (code, isDay = 1) => {
  const codes = {
    0: { label: 'CLEAR SKY', icon: isDay ? Sun : Moon, color: isDay ? 'text-orange-500 drop-shadow-md' : 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
    1: { label: 'MAINLY CLEAR', icon: isDay ? Sun : Moon, color: isDay ? 'text-orange-400' : 'text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]' },
    2: { label: 'PARTLY CLOUDY', icon: Cloud, color: isDay ? 'text-blue-500' : 'text-cyan-200' },
    3: { label: 'OVERCAST', icon: Cloud, color: 'text-slate-400' },
    45: { label: 'FOG', icon: Cloud, color: 'text-slate-400' },
    48: { label: 'RIME FOG', icon: Cloud, color: 'text-slate-400' },
    51: { label: 'LIGHT DRIZZLE', icon: CloudRain, color: 'text-blue-400' },
    53: { label: 'MODERATE DRIZZLE', icon: CloudRain, color: 'text-blue-500' },
    55: { label: 'DENSE DRIZZLE', icon: CloudRain, color: 'text-blue-600' },
    61: { label: 'SLIGHT RAIN', icon: CloudRain, color: 'text-blue-500' },
    63: { label: 'MODERATE RAIN', icon: CloudRain, color: 'text-blue-600' },
    65: { label: 'HEAVY RAIN', icon: CloudRain, color: 'text-blue-700' },
    71: { label: 'SLIGHT SNOW', icon: CloudSnow, color: isDay ? 'text-slate-600' : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' },
    73: { label: 'MODERATE SNOW', icon: CloudSnow, color: isDay ? 'text-slate-700' : 'text-white' },
    75: { label: 'HEAVY SNOW', icon: CloudSnow, color: isDay ? 'text-slate-800' : 'text-white' },
    95: { label: 'THUNDERSTORM', icon: CloudLightning, color: 'text-purple-500' },
  };
  return codes[code] || { label: 'UNKNOWN', icon: Cloud, color: 'text-gray-400' };
};

// --- Custom Hook for Local Time ---
const useLocalTime = (timezone) => {
  const [timeData, setTimeData] = useState({ time: '', phase: '', progress: 0 });

  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const now = new Date();
      // Get the time in the target timezone
      const options = { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      
      // Get 24h hour for phase calculation
      const hour24 = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hour12: false }).format(now), 10);
      const minute = now.getMinutes();
      
      // Calculate progress (0 to 100% of the day)
      const totalMinutes = (hour24 * 60) + minute;
      const progress = (totalMinutes / 1440) * 100;

      let phase = 'NIGHT'; 

      // Time of Day Conventions (24-hour format)
      if (hour24 >= 6 && hour24 < 12) {
          phase = 'MORNING'; 
      } else if (hour24 >= 12 && hour24 < 17) {
          phase = 'AFTERNOON'; 
      } else if (hour24 >= 17 && hour24 < 21) {
          phase = 'EVENING'; 
      } else if (hour24 >= 0 && hour24 < 3) {
          phase = 'LATE NIGHT'; 
      } else if (hour24 >= 3 && hour24 < 6) {
          phase = 'EARLY MORNING'; 
      } else {
          phase = 'NIGHT';
      }

      setTimeData({ time: timeString, phase, progress });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); 
    return () => clearInterval(interval);
  }, [timezone]);

  return timeData;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('c');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [locationName, setLocationName] = useState('New York');
  const [locationCandidates, setLocationCandidates] = useState([]); 


  // Function to fetch weather using coordinates (for selection)
  const fetchWeatherForCoords = async (latitude, longitude, name, country) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]); // Clear the candidates list after a selection is made
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      
      // Set location only after successful weather data retrieval (fixes location/theme lag)
      setLocationName(`${name}, ${country}`.toUpperCase());
      
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a list of candidates (for search bar input)
  const fetchCandidates = async (city) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]);
    try {
      // Removed &count=1 to get multiple results
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('LOCATION NOT FOUND. Try refining your search (e.g., "Paris, France").');
      }

      // Store candidates, limiting to top 5
      setLocationCandidates(geoData.results.slice(0, 5));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch single location (for initial load and favorites)
  const fetchSingleLocation = async (city) => {
    setLoading(true);
    setError(null);
    setLocationCandidates([]);
    try {
      // Use count=1 for initial/favorite search for efficiency
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        // If single search fails, try a wider candidate search
        // FIX: Added 'await' here to ensure fetchCandidates completes before returning
        return await fetchCandidates(city); 
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeatherForCoords(latitude, longitude, name, country);

    } catch (err) {
      setError(err.message);
    } finally {
      // Loading is set to false in fetchWeatherForCoords or fetchCandidates
    }
  };


  // Initial load effect
  useEffect(() => {
    fetchSingleLocation('New York');
  }, []);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = () => setUnit(prev => prev === 'c' ? 'f' : 'c');

  const convertTemp = (tempC) => {
    if (unit === 'c') return Math.round(tempC);
    return Math.round((tempC * 9/5) + 32);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Search button now populates the candidate list
      fetchCandidates(query);
      // Do not clear query so user can refine
    }
  };
  
  const selectLocation = (candidate) => {
      const { latitude, longitude, name, country } = candidate;
      fetchWeatherForCoords(latitude, longitude, name, country);
      setQuery(''); // Clear search query after successful selection
  };

  const toggleFavorite = () => {
    if (favorites.includes(locationName)) {
      setFavorites(favorites.filter(f => f !== locationName));
    } else {
      setFavorites([...favorites, locationName]);
    }
  };

  // --- THEME ENGINE ---
  const isDayTheme = weather?.current?.is_day === 1;

  // Calculate local time based on the fetched timezone
  const { time, phase, progress } = useLocalTime(weather?.timezone);

  // Dynamic Style Classes (Updated for Night Theme Contrast)
  const styles = isDayTheme ? {
    wrapper: 'bg-slate-100 text-slate-800 selection:bg-blue-500/30 selection:text-blue-900',
    grid: 'bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]',
    glow1: 'bg-orange-500/20',
    glow2: 'bg-blue-500/20',
    panel: 'bg-white/60 border-slate-300 shadow-xl backdrop-blur-md',
    border: 'border-slate-300',
    textMain: 'text-slate-800',
    textMuted: 'text-slate-500',
    textAccent: 'text-blue-600',
    textHighlight: 'text-orange-500',
    inputBg: 'bg-white border-slate-200 text-slate-800 placeholder-slate-400',
    button: 'border-slate-300 text-slate-600 hover:bg-slate-200',
    buttonActive: 'bg-orange-100 text-orange-600 border-orange-200',
    moduleBg: 'bg-slate-50/50 border-slate-200 hover:border-blue-400/50',
    barBg: 'bg-slate-200',
    barFill: 'bg-blue-500'
  } : {
    wrapper: 'bg-black text-cyan-50 selection:bg-pink-500/30 selection:text-white',
    grid: 'bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)]',
    glow1: 'bg-cyan-500/10',
    glow2: 'bg-pink-500/10',
    panel: 'bg-black/40 border-cyan-900/50 shadow-[0_0_50px_-12px_rgba(8,145,178,0.2)] backdrop-blur-md',
    border: 'border-cyan-900/50',
    textMain: 'text-white', 
    textMuted: 'text-cyan-900/80', 
    textAccent: 'text-cyan-400',
    textHighlight: 'text-pink-500', 
    inputBg: 'bg-black border-cyan-900/30 text-cyan-100 placeholder-cyan-900/50',
    button: 'border-cyan-900/50 text-cyan-700 hover:border-pink-500/50 hover:text-pink-400',
    buttonActive: 'border-pink-500 bg-pink-500/10 text-pink-400',
    moduleBg: 'bg-cyan-950/20 border-cyan-900/30 hover:border-cyan-500/50',
    barBg: 'bg-cyan-900/80', 
    barFill: 'bg-cyan-500'
  };

  if (loading && !weather) return (
    <div className="min-h-screen bg-black text-cyan-500 font-mono flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
      <div className="text-sm tracking-widest animate-pulse">CONNECTING...</div>
    </div>
  );

  const currentCode = weather?.current?.weather_code;
  const isDay = weather?.current?.is_day;
  const CurrentIconData = getWeatherDescription(currentCode, isDay);
  const CurrentIcon = CurrentIconData.icon;

  const tomorrowCode = weather?.daily?.weather_code?.[1];
  const TomorrowIconData = getWeatherDescription(tomorrowCode, 1);
  const TomorrowIcon = TomorrowIconData.icon;

  const isFavorite = favorites.includes(locationName);

  return (
    <div className={`min-h-screen font-mono px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex justify-center items-stretch relative overflow-hidden transition-colors duration-1000 ${styles.wrapper}`}>

      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 z-0"
        src={isDayTheme ? "https://www.megazone.com/images/main/video/ai_native.mp4" : "https://www.megazone.com/images/main/video/cloud_native.mp4"}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dynamic Grid Background */}
      <div className={`absolute inset-0 bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-all duration-1000 ${styles.grid}`}></div>

      {/* Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow1}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow2}`}></div>

      <div className="relative w-full max-w-6xl z-10">
        {/* Logo - Pinned Top Left */}
        <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6`}>
          <img
            src="/logo.svg"
            alt="Cloud Magazine - A Megazone Cloud Weather App"
            className={`h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 2xl:h-24 w-auto transition-all duration-1000 ${!isDayTheme ? 'brightness-0 invert saturate-150' : ''}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(0,1fr)] gap-4 sm:gap-6 md:gap-8 pt-14 sm:pt-18 md:pt-22 lg:pt-24 xl:pt-28">

        {/* --- LEFT PANEL: CONTROL DECK --- */}
        <div className="md:col-span-4 space-y-3 sm:space-y-4">
          <div className={`p-3 sm:p-4 md:p-5 relative group overflow-hidden border ${styles.panel}`}>
            {/* Decorative Corner Markers */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>

            <form onSubmit={handleSearch} className="relative mb-3 sm:mb-4 md:mb-6 group">
              <div className={`relative flex items-center rounded-lg border ${styles.inputBg}`}>
                <Search className={`absolute left-2 sm:left-3 h-3 w-3 sm:h-4 sm:w-4 ${styles.textMuted}`} />
                <input
                  type="text"
                  placeholder="SEARCH LOCATION"
                  className="w-full bg-transparent border-none py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 focus:ring-0 uppercase text-xs sm:text-sm tracking-wider placeholder-opacity-50"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Favorites List / Candidate List */}
            <div className="space-y-3">
              <div className={`flex justify-between items-end border-b pb-2 mb-4 ${styles.border}`}>
                <h3 className={`text-xs font-bold flex items-center gap-2 ${styles.textAccent}`}>
                  <Radio className="h-3 w-3 animate-pulse" />
                  {locationCandidates.length > 0 ? 'SELECT LOCATION' : 'SAVED PLACES'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDayTheme ? 'bg-slate-200 text-slate-600' : 'bg-cyan-950 text-cyan-800'}`}>
                  COUNT: {locationCandidates.length > 0 ? locationCandidates.length.toString().padStart(2, '0') : favorites.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  /* LOADING MESSAGE (Hides favorites during search) */
                  <div className={`text-xs border border-dashed p-4 text-center ${styles.textMuted} ${styles.border}`}>
                    SEARCHING...
                  </div>
                ) : locationCandidates.length > 0 ? (
                  /* --- LOCATION CANDIDATES LIST --- */
                  locationCandidates.map(candidate => (
                    <button
                      key={`${candidate.latitude}-${candidate.longitude}`}
                      onClick={() => selectLocation(candidate)}
                      className={`w-full text-left px-3 py-2.5 sm:py-2 border transition-all flex items-center justify-between group touch-manipulation ${isDayTheme ? 'border-slate-200 hover:bg-slate-100 active:bg-slate-200' : 'border-cyan-900/30 hover:border-cyan-500/50 hover:bg-cyan-950/30 active:bg-cyan-950/50'}`}
                    >
                      <span className={`truncate text-xs font-medium tracking-wide ${styles.textMain}`}>
                        {candidate.name}, {candidate.admin1 || candidate.country}
                      </span>
                      <ArrowRight className={`h-3 w-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all transform sm:group-hover:-translate-x-1 ${styles.textHighlight}`} />
                    </button>
                  ))
                ) : favorites.length === 0 ? (
                  /* --- NO DATA MESSAGE --- */
                  <div className={`text-xs border border-dashed p-4 text-center ${styles.textMuted} ${styles.border}`}>
                    NO DATA
                  </div>
                ) : (
                  /* --- FAVORITES LIST --- */
                  favorites.map(city => (
                    <button
                      key={city}
                      onClick={() => fetchSingleLocation(city)} // Load saved favorite directly
                      className={`w-full text-left px-3 py-2.5 sm:py-2 border transition-all flex items-center justify-between group touch-manipulation ${isDayTheme ? 'border-slate-200 hover:bg-slate-100 active:bg-slate-200' : 'border-cyan-900/30 hover:border-cyan-500/50 hover:bg-cyan-950/30 active:bg-cyan-950/50'}`}
                    >
                      <span className={`truncate text-xs font-medium tracking-wide ${styles.textMain}`}>{city}</span>
                      <Star className={`h-3 w-3 ${styles.textHighlight} fill-current`} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className={`border-t pt-4 px-2 ${styles.border}`}>
            <div className={`flex justify-between text-[10px] uppercase tracking-widest ${styles.textMuted}`}>
              <span>ONLINE</span>
              <span>V 2.5</span>
            </div>
            <div className={`w-full h-1 mt-2 overflow-hidden ${isDayTheme ? 'bg-slate-200' : 'bg-cyan-950/50'}`}>
               <div className={`h-full w-1/3 animate-pulse ${isDayTheme ? 'bg-blue-400' : 'bg-cyan-600'}`}></div>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: DATA VISUALIZATION --- */}
        <div className="md:col-span-8 flex flex-col gap-3 sm:gap-4">

          {/* Main Weather Holo-Card */}
          <div className={`relative border-x p-3 sm:p-4 md:p-6 ${styles.panel} flex flex-col gap-6`}>
            {/* Tech Decoration Lines */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-blue-500' : 'via-cyan-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-orange-500' : 'via-pink-500'}`}></div>

            {error ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center border border-red-500/30 bg-red-500/5 p-8">
                <CloudRain className="h-16 w-16 mb-4 text-red-500/50" />
                <h2 className="text-xl font-bold text-red-500 mb-2 tracking-widest">ERROR</h2>
                <p className="text-red-400 text-sm font-mono mb-6">{'>'} {error}</p>
                <button onClick={() => fetchSingleLocation('New York')} className="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-xs tracking-widest">
                  Reset
                </button>
              </div>
            ) : weather ? (
              <>
                {/* Header */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-5 md:mb-6 relative z-10 border-b pb-3 sm:pb-4 ${styles.border}`}>
                  <div className="md:w-3/5">
                    <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-8 mb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] ${styles.textAccent}`}>LIVE FEED</span>
                        </div>
                    </div>

                    {/* CONSOLIDATED LOCATION/PHASE/TIME LINE - STACKED VERTICALLY */}
                    <div className="flex flex-col mb-3 sm:mb-4">
                        {/* 1. Phase + IN */}
                        <div className={`text-xs sm:text-sm font-bold tracking-widest ${styles.textMain} mb-1`}>
                           <strong className={`text-base sm:text-lg md:text-xl ${styles.textHighlight}`}>{phase}</strong> 
                           <span className="mx-1 sm:mx-2">IN</span>
                        </div>
                        {/* 2. Location Name */}
                        <div className={`text-lg sm:text-xl md:text-2xl font-bold tracking-widest ${styles.textMain} mb-2 break-words`}>
                            {locationName}
                        </div>
                        {/* 3. Time */}
                        <div className={`text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-1 ${styles.textMuted}`}>
                            <ClockIcon className="h-3 w-3" />
                            {time}
                        </div>
                    </div>
                    
                    {/* Time Progress Bar */}
                    <div className="mt-3 sm:mt-4 max-w-xl">
                        <div className={`flex justify-between text-[7px] sm:text-[8px] uppercase tracking-widest mb-1 ${styles.textMuted}`}>
                            <span>00:00</span>
                            <span>12:00</span>
                            <span>23:59</span>
                        </div>
                        <div className={`w-full h-1 sm:h-1.5 relative ${styles.barBg}`}>
                             {/* The Progress Fill */}
                             <div className={`h-full opacity-50 ${styles.barFill}`} style={{ width: `${progress}%` }}></div>
                             {/* The Current Time Marker */}
                             <div className={`absolute top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-2 sm:h-3 bg-white shadow-lg shadow-current ${styles.textHighlight}`} style={{ left: `${progress}%` }}></div>
                        </div>
                         <p className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest ${styles.textMuted}`}>
                           LAT: {weather.latitude.toFixed(2)} // LON: {weather.longitude.toFixed(2)}
                        </p>
                    </div>

                  </div>

                  <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-0">
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 sm:p-3 border transition-all touch-manipulation ${isFavorite ? styles.buttonActive : styles.button}`}
                      aria-label="Toggle favorite"
                    >
                      <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={toggleUnit}
                      className={`px-4 sm:px-6 py-1.5 sm:py-2 border transition-all font-bold tracking-widest text-xs sm:text-sm touch-manipulation ${styles.button}`}
                      aria-label="Toggle temperature unit"
                    >
                      °{unit.toUpperCase()}
                    </button>
                  </div>
                </div>

                {/* Main Data Display */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
                  <div className="relative">
                     {/* Temperature Display */}
                    <div className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter relative z-10 ${styles.textMain}`} style={{ textShadow: isDayTheme ? 'none' : '4px 4px 0px rgba(8,145,178,0.4)' }}>
                      {convertTemp(weather.current.temperature_2m)}°
                    </div>
                    <div className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 border-l-4 pl-2 sm:pl-4 ${styles.textHighlight} ${isDayTheme ? 'border-orange-500' : 'border-pink-500'}`}>
                      {CurrentIconData.label}
                    </div>
                  </div>

                  <div className="relative group">
                     <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${isDayTheme ? 'bg-orange-500/30' : 'bg-cyan-500/20'}`}></div>
                     {/* Responsive icon sizing for all screens */}
                     <CurrentIcon className={`h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-44 lg:w-44 relative z-10 transition-transform duration-500 group-hover:scale-105 ${CurrentIconData.color}`} strokeWidth={1} />
                  </div>
                </div>

                {/* Grid Modules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8">

                  {/* Module 1: WIND */}
                  <div className={`p-3 sm:p-4 flex flex-col justify-between min-h-[7rem] sm:min-h-[8rem] relative overflow-hidden group transition-colors border ${styles.moduleBg}`}>
                    <div className="absolute top-0 right-0 p-1.5 sm:p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Wind className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${styles.textAccent}`} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest ${styles.textHighlight}`}>WIND</span>
                    <div>
                        <span className={`text-2xl sm:text-3xl font-bold ${styles.textMain}`}>{weather.current.wind_speed_10m}</span> 
                        <span className={`text-[10px] sm:text-xs ml-1 ${styles.textAccent}`}>KM/H</span>
                    </div>
                    <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 ${styles.barFill}`} style={{ width: `${Math.min(weather.current.wind_speed_10m * 2, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Module 2: HUMIDITY */}
                  <div className={`p-3 sm:p-4 flex flex-col justify-between min-h-[7rem] sm:min-h-[8rem] relative overflow-hidden group transition-colors border ${styles.moduleBg}`}>
                    <div className="absolute top-0 right-0 p-1.5 sm:p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Droplets className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${styles.textAccent}`} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest ${styles.textHighlight}`}>HUMIDITY</span>
                    <div>
                        <span className={`text-2xl sm:text-3xl font-bold ${styles.textMain}`}>{weather.current.relative_humidity_2m}</span>
                        <span className={`text-[10px] sm:text-xs ml-1 ${styles.textAccent}`}>%</span>
                    </div>
                     <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 ${styles.barFill}`} style={{ width: `${weather.current.relative_humidity_2m}%` }}></div>
                    </div>
                  </div>

                  {/* Module 3: FEELS LIKE (Fixed colors) */}
                  <div className={`p-3 sm:p-4 flex flex-col justify-between min-h-[7rem] sm:min-h-[8rem] relative overflow-hidden group transition-colors border ${styles.moduleBg} sm:col-span-2 md:col-span-1`}>
                    <div className="absolute top-0 right-0 p-1.5 sm:p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Thermometer className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${styles.textAccent}`} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest ${styles.textHighlight}`}>FEELS LIKE</span>
                    <div>
                        <span className={`text-2xl sm:text-3xl font-bold ${styles.textMain}`}>{convertTemp(weather.current.apparent_temperature)}</span>
                        <span className={`text-[10px] sm:text-xs ml-1 ${styles.textAccent}`}>°{unit.toUpperCase()}</span>
                    </div>
                     <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 ${styles.barFill}`} style={{ width: '60%' }}></div>
                    </div>
                  </div>

                </div>
              </>
            ) : null}
          </div>

          {/* Tomorrow Forecast Strip */}
          {weather && !error && (
            <div className={`border p-1 relative flex items-center gap-2 sm:gap-4 group ${isDayTheme ? 'bg-white/80 border-slate-300' : 'bg-black/80 border-cyan-900/30'}`}>
               <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-6 sm:h-8 ${isDayTheme ? 'bg-orange-500' : 'bg-pink-500'}`}></div>
               <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div className={`p-2 sm:p-3 rounded border ${isDayTheme ? 'bg-slate-100 border-slate-300' : 'bg-cyan-950/50 border-cyan-500/20'}`}>
                         <TomorrowIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${TomorrowIconData.color}`} />
                    </div>
                    <div>
                        <div className={`text-[9px] sm:text-[10px] uppercase tracking-widest mb-1 ${styles.textHighlight}`}>TOMORROW</div>
                        <div className={`text-base sm:text-lg md:text-xl font-bold ${styles.textMain} break-words`}>{TomorrowIconData.label}</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                     <span className={`block text-2xl sm:text-3xl font-bold ${styles.textMain}`}>{convertTemp(weather.daily.temperature_2m_max[1])}°</span>
                     <span className={`text-[10px] sm:text-xs font-mono ${styles.textMuted}`}>
                        LO:{convertTemp(weather.daily.temperature_2m_min[1])}° HI:{convertTemp(weather.daily.temperature_2m_max[1])}°
                     </span>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
  );
}