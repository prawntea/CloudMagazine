import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Thermometer, Wind, Droplets, ArrowRight, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Moon, Terminal, Cpu, Radio, Navigation } from 'lucide-react';

// --- API Helpers ---

const getWeatherDescription = (code, isDay = 1) => {
  // Adjusted colors to be visible in both Day (Light) and Night (Dark) modes
  // darker shades for day visibility where needed
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

  useEffect(() => {
    fetchWeather('New York');
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = () => setUnit(prev => prev === 'c' ? 'f' : 'c');

  const convertTemp = (tempC) => {
    if (unit === 'c') return Math.round(tempC);
    return Math.round((tempC * 9/5) + 32);
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('LOCATION NOT FOUND');
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setLocationName(`${name}, ${country}`.toUpperCase());

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeather(query);
      setQuery('');
    }
  };

  const toggleFavorite = () => {
    if (favorites.includes(locationName)) {
      setFavorites(favorites.filter(f => f !== locationName));
    } else {
      setFavorites([...favorites, locationName]);
    }
  };

  // --- THEME ENGINE ---
  // Determine if it is Day (1) or Night (0). Default to Night (0) if loading.
  const isDayTheme = weather?.current?.is_day === 1;

  // Dynamic Style Classes
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
    inputBg: 'bg-black text-cyan-100 placeholder-cyan-900/50',
    button: 'border-cyan-900/50 text-cyan-700 hover:border-pink-500/50 hover:text-pink-400',
    buttonActive: 'border-pink-500 bg-pink-500/10 text-pink-400',
    moduleBg: 'bg-cyan-950/20 border-cyan-900/30 hover:border-cyan-500/50',
    barBg: 'bg-cyan-900/30',
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

  const tomorrowCode = weather?.daily?.weather_code[1];
  const TomorrowIconData = getWeatherDescription(tomorrowCode, 1);
  const TomorrowIcon = TomorrowIconData.icon;

  const isFavorite = favorites.includes(locationName);

  return (
    <div className={`min-h-screen font-mono p-4 md:p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-1000 ${styles.wrapper}`}>

      {/* Background video (switches depending on day/night theme) */}
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
      <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-all duration-1000 ${styles.grid}`}></div>

      {/* Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow1}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${styles.glow2}`}></div>

      {/* Logo and Tagline - Top Left */}
      <div className={`absolute top-8 left-8 flex flex-col items-center gap-2 z-20`}>
        <img src="/logo.svg" alt="Cloud Magazine" className={`h-32 w-auto transition-all duration-1000 ${!isDayTheme ? 'brightness-0 invert saturate-150' : ''}`} />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* --- LEFT PANEL: CONTROL DECK --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 relative group overflow-hidden border ${styles.panel}`}>
            {/* Decorative Corner Markers */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${isDayTheme ? 'border-blue-500' : 'border-cyan-500'}`}></div>

            <form onSubmit={handleSearch} className="relative mb-8 group">
              <div className={`relative flex items-center rounded-lg border ${styles.inputBg}`}>
                <Search className={`absolute left-3 h-4 w-4 ${styles.textMuted}`} />
                <input
                  type="text"
                  placeholder="SEARCH LOCATION..."
                  className="w-full bg-transparent border-none py-3 pl-10 pr-4 focus:ring-0 uppercase text-sm tracking-wider placeholder-opacity-50"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Favorites List */}
            <div className="space-y-3">
              <div className={`flex justify-between items-end border-b pb-2 mb-4 ${styles.border}`}>
                <h3 className={`text-xs font-bold flex items-center gap-2 ${styles.textAccent}`}>
                  <Radio className="h-3 w-3 animate-pulse" />
                  SAVED PLACES
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDayTheme ? 'bg-slate-200 text-slate-600' : 'bg-cyan-950 text-cyan-800'}`}>
                  COUNT: {favorites.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {favorites.length === 0 && (
                  <div className={`text-xs border border-dashed p-4 text-center ${styles.textMuted} ${styles.border}`}>
                    NO DATA
                  </div>
                )}
                {favorites.map(city => (
                  <button
                    key={city}
                    onClick={() => fetchWeather(city)}
                    className={`w-full text-left px-3 py-2 border transition-all flex items-center justify-between group ${isDayTheme ? 'border-slate-200 hover:bg-slate-100' : 'border-cyan-900/30 hover:border-cyan-500/50 hover:bg-cyan-950/30'}`}
                  >
                    <span className={`truncate text-xs font-medium tracking-wide ${styles.textMain}`}>{city}</span>
                    <ArrowRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-1 ${styles.textHighlight}`} />
                  </button>
                ))}
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
        <div className="lg:col-span-8 space-y-6">

          {/* Main Weather Holo-Card */}
          <div className={`relative border-x p-8 ${styles.panel}`}>
            {/* Tech Decoration Lines */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-blue-500' : 'via-cyan-500'}`}></div>
            <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-orange-500' : 'via-pink-500'}`}></div>

            {error ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center border border-red-500/30 bg-red-500/5 p-8">
                <CloudRain className="h-16 w-16 mb-4 text-red-500/50" />
                <h2 className="text-xl font-bold text-red-500 mb-2 tracking-widest">ERROR</h2>
                <p className="text-red-400 text-sm font-mono mb-6">{'>'} {error}</p>
                <button onClick={() => fetchWeather('New York')} className="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-xs tracking-widest">
                  Reset
                </button>
              </div>
            ) : weather ? (
              <>
                {/* Header */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between mb-10 relative z-10 border-b pb-6 ${styles.border}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className={`text-[10px] tracking-[0.2em] ${styles.textAccent}`}>LIVE FEED</span>
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter flex items-center gap-3 ${styles.textMain}`}>
                      {locationName}
                    </h2>
                    <p className={`mt-2 text-xs font-mono uppercase tracking-widest ${styles.textMuted}`}>
                       LAT: {weather.latitude.toFixed(2)} // LON: {weather.longitude.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-4 md:mt-0">
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 border transition-all ${isFavorite ? styles.buttonActive : styles.button}`}
                    >
                      <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={toggleUnit}
                      className={`px-6 py-2 border transition-all font-bold tracking-widest ${styles.button}`}
                    >
                      °{unit.toUpperCase()}
                    </button>
                  </div>
                </div>

                {/* Main Data Display */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="relative">
                     {/* Temperature Display */}
                    <div className={`text-9xl font-bold tracking-tighter relative z-10 ${styles.textMain}`} style={{ textShadow: isDayTheme ? 'none' : '4px 4px 0px rgba(8,145,178,0.4)' }}>
                      {convertTemp(weather.current.temperature_2m)}°
                    </div>
                    <div className={`text-lg font-bold tracking-[0.3em] uppercase mt-2 border-l-4 pl-4 ${styles.textHighlight} ${isDayTheme ? 'border-orange-500' : 'border-pink-500'}`}>
                      {CurrentIconData.label}
                    </div>
                  </div>

                  <div className="relative group">
                     <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${isDayTheme ? 'bg-orange-500/30' : 'bg-cyan-500/20'}`}></div>
                     <CurrentIcon className={`h-48 w-48 relative z-10 transition-transform duration-500 group-hover:scale-105 ${CurrentIconData.color}`} strokeWidth={1} />
                  </div>
                </div>

                {/* Grid Modules */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">

                  {/* Module 1 */}
                  <div className={`p-4 flex flex-col justify-between h-32 relative overflow-hidden group transition-colors ${styles.moduleBg}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Wind className={`h-12 w-12 ${styles.textAccent}`} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>WIND</span>
                    <div>
                        <span className={`text-3xl font-bold ${styles.textMain}`}>{weather.current.wind_speed_10m}</span>
                        <span className={`text-xs ml-1 ${styles.textAccent}`}>KM/H</span>
                    </div>
                    <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 ${styles.barFill}`} style={{ width: `${Math.min(weather.current.wind_speed_10m * 2, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Module 2 */}
                  <div className={`p-4 flex flex-col justify-between h-32 relative overflow-hidden group transition-colors ${styles.moduleBg}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Droplets className={`h-12 w-12 ${styles.textAccent}`} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>HUMIDITY</span>
                    <div>
                        <span className={`text-3xl font-bold ${styles.textMain}`}>{weather.current.relative_humidity_2m}</span>
                        <span className={`text-xs ml-1 ${styles.textAccent}`}>%</span>
                    </div>
                     <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 ${styles.barFill}`} style={{ width: `${weather.current.relative_humidity_2m}%` }}></div>
                    </div>
                  </div>

                  {/* Module 3 */}
                  <div className={`p-4 flex flex-col justify-between h-32 relative overflow-hidden group transition-colors ${styles.moduleBg}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Thermometer className={`h-12 w-12 ${styles.textHighlight}`} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>FEELS LIKE</span>
                    <div>
                        <span className={`text-3xl font-bold ${styles.textMain}`}>{convertTemp(weather.current.apparent_temperature)}</span>
                        <span className={`text-xs ml-1 ${styles.textAccent}`}>°{unit.toUpperCase()}</span>
                    </div>
                     <div className={`w-full h-1 mt-2 ${styles.barBg}`}>
                        <div className={`h-full transition-all duration-1000 bg-pink-500`} style={{ width: '60%' }}></div>
                    </div>
                  </div>

                </div>
              </>
            ) : null}
          </div>

          {/* Tomorrow Forecast Strip */}
          {weather && !error && (
            <div className={`border p-1 relative flex items-center gap-4 group ${isDayTheme ? 'bg-white/80 border-slate-300' : 'bg-black/80 border-cyan-900/30'}`}>
               <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 ${isDayTheme ? 'bg-orange-500' : 'bg-pink-500'}`}></div>
               <div className="p-6 flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded border ${isDayTheme ? 'bg-slate-100 border-slate-300' : 'bg-cyan-950/50 border-cyan-500/20'}`}>
                         <TomorrowIcon className={`h-8 w-8 ${TomorrowIconData.color}`} />
                    </div>
                    <div>
                        <div className={`text-[10px] uppercase tracking-widest mb-1 ${styles.textHighlight}`}>TOMORROW</div>
                        <div className={`text-xl font-bold ${styles.textMain}`}>{TomorrowIconData.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className={`block text-3xl font-bold ${styles.textMain}`}>{convertTemp(weather.daily.temperature_2m_max[1])}°</span>
                     <span className={`text-xs font-mono ${styles.textMuted}`}>
                        LO:{convertTemp(weather.daily.temperature_2m_min[1])}° HI:{convertTemp(weather.daily.temperature_2m_max[1])}°
                     </span>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}