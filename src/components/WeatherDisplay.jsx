/**
 * WeatherDisplay Component
 * Main weather information panel showing current conditions, temperature, and metrics
 */
import { Star, Clock as ClockIcon, Wind, Droplets, Thermometer, CloudRain } from 'lucide-react';
import { convertTemp } from '../utils/temperatureUtils';
import { getWeatherDescription } from '../utils/weatherHelpers';

export const WeatherDisplay = ({
  weather,
  error,
  unit,
  toggleUnit,
  isFavorite,
  toggleFavorite,
  locationName,
  time,
  phase,
  progress,
  fetchSingleLocation,
  isDayTheme,
  styles
}) => {
  // Error state display
  if (error) {
    return (
      <div className={`relative border-x p-3 sm:p-4 md:p-6 ${styles.panel} flex flex-col gap-6`}>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center border border-red-500/30 bg-red-500/5 p-8">
          <CloudRain className="h-16 w-16 mb-4 text-red-500/50" />
          <h2 className="text-xl font-bold text-red-500 mb-2 tracking-widest">ERROR</h2>
          <p className="text-red-400 text-sm font-mono mb-6">{'>'} {error}</p>
          <button
            onClick={() => fetchSingleLocation('New York')}
            className="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-xs tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  // Get weather icon and description based on current conditions
  const currentCode = weather?.current?.weather_code;
  const isDay = weather?.current?.is_day;
  const CurrentIconData = getWeatherDescription(currentCode, isDay);
  const CurrentIcon = CurrentIconData.icon;

  return (
    <div className={`relative border-x p-3 sm:p-4 md:p-6 ${styles.panel} flex flex-col gap-6`}>
      {/* Decorative gradient lines at top and bottom */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-blue-500' : 'via-cyan-500'}`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 ${isDayTheme ? 'via-orange-500' : 'via-pink-500'}`}></div>

      {/* Header section with location, time, and controls */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-5 md:mb-6 relative z-10 border-b pb-3 sm:pb-4 ${styles.border}`}>
        <div className="md:w-3/5">
          <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-8 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] ${styles.textAccent}`}>LIVE FEED</span>
            </div>
          </div>

          <div className="flex flex-col mb-3 sm:mb-4">
            <div className={`text-xs sm:text-sm font-bold tracking-widest ${styles.textMain} mb-1`}>
              <strong className={`text-base sm:text-lg md:text-xl ${styles.textHighlight}`}>{phase}</strong>
              <span className="mx-1 sm:mx-2">IN</span>
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl font-bold tracking-widest ${styles.textMain} mb-2 break-words`}>
              {locationName}
            </div>
            <div className={`text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-1 ${styles.textMuted}`}>
              <ClockIcon className="h-3 w-3" />
              {time}
            </div>
          </div>

          {/* Time progress bar showing current time of day */}
          <div className="mt-3 sm:mt-4 max-w-xl">
            <div className={`flex justify-between text-[7px] sm:text-[8px] uppercase tracking-widest mb-1 ${styles.textMuted}`}>
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
            <div className={`w-full h-1 sm:h-1.5 relative ${styles.barBg}`}>
              <div className={`h-full opacity-50 ${styles.barFill}`} style={{ width: `${progress}%` }}></div>
              <div className={`absolute top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-2 sm:h-3 bg-white shadow-lg shadow-current ${styles.textHighlight}`} style={{ left: `${progress}%` }}></div>
            </div>
            <p className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest ${styles.textMuted}`}>
              LAT: {weather.latitude.toFixed(2)} // LON: {weather.longitude.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action buttons: favorite and unit toggle */}
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

      {/* Main temperature and weather icon display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
        <div className="relative">
          <div className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter relative z-10 ${styles.textMain}`} style={{ textShadow: isDayTheme ? 'none' : '4px 4px 0px rgba(8,145,178,0.4)' }}>
            {convertTemp(weather.current.temperature_2m, unit)}°
          </div>
          <div className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 border-l-4 pl-2 sm:pl-4 ${styles.textHighlight} ${isDayTheme ? 'border-orange-500' : 'border-pink-500'}`}>
            {CurrentIconData.label}
          </div>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${isDayTheme ? 'bg-orange-500/30' : 'bg-cyan-500/20'}`}></div>
          <CurrentIcon className={`h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-44 lg:w-44 relative z-10 transition-transform duration-500 group-hover:scale-105 ${CurrentIconData.color}`} strokeWidth={1} />
        </div>
      </div>

      {/* Weather metrics grid: wind, humidity, feels like */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
        {/* Wind speed module */}
        <div className={`p-4 sm:p-5 md:p-6 flex flex-col justify-center min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] relative overflow-hidden group transition-colors border ${styles.moduleBg}`}>
          <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-20 group-hover:opacity-50 transition-opacity">
            <Wind className={`h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 ${styles.textAccent}`} />
          </div>
          <span className={`text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 ${styles.textHighlight}`}>WIND</span>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className={`text-4xl sm:text-5xl md:text-6xl font-bold ${styles.textMain}`}>{weather.current.wind_speed_10m}</span>
            <span className={`text-sm sm:text-base md:text-lg ${styles.textAccent}`}>KM/H</span>
          </div>
        </div>

        {/* Humidity percentage module */}
        <div className={`p-4 sm:p-5 md:p-6 flex flex-col justify-center min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] relative overflow-hidden group transition-colors border ${styles.moduleBg}`}>
          <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-20 group-hover:opacity-50 transition-opacity">
            <Droplets className={`h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 ${styles.textAccent}`} />
          </div>
          <span className={`text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 ${styles.textHighlight}`}>HUMIDITY</span>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className={`text-4xl sm:text-5xl md:text-6xl font-bold ${styles.textMain}`}>{weather.current.relative_humidity_2m}</span>
            <span className={`text-sm sm:text-base md:text-lg ${styles.textAccent}`}>%</span>
          </div>
        </div>

        {/* Apparent temperature (feels like) module */}
        <div className={`p-4 sm:p-5 md:p-6 flex flex-col justify-center min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] relative overflow-hidden group transition-colors border ${styles.moduleBg} sm:col-span-2 md:col-span-1`}>
          <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-20 group-hover:opacity-50 transition-opacity">
            <Thermometer className={`h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 ${styles.textAccent}`} />
          </div>
          <span className={`text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 ${styles.textHighlight}`}>FEELS LIKE</span>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className={`text-4xl sm:text-5xl md:text-6xl font-bold ${styles.textMain}`}>{convertTemp(weather.current.apparent_temperature, unit)}</span>
            <span className={`text-sm sm:text-base md:text-lg ${styles.textAccent}`}>°{unit.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};