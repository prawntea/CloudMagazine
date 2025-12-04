/**
 * TomorrowForecast Component
 * Displays tomorrow's weather forecast with icon, conditions, and temperature range
 */
import React from 'react';
import { convertTemp } from '../utils/temperatureUtils';
import { getWeatherDescription } from '../utils/weatherHelpers';

export const TomorrowForecast = ({ weather, unit, isDayTheme, styles }) => {
  if (!weather) return null;

  // Get tomorrow's weather data (index 1 in daily array)
  const tomorrowCode = weather?.daily?.weather_code?.[1];
  const TomorrowIconData = getWeatherDescription(tomorrowCode, 1);
  const TomorrowIcon = TomorrowIconData.icon;

  return (
    <div className={`border p-1 relative flex items-center gap-2 sm:gap-3 group ${isDayTheme ? 'bg-white/80 border-slate-300' : 'bg-black/80 border-cyan-900/30'}`}>
      <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-6 sm:h-8 ${isDayTheme ? 'bg-orange-500' : 'bg-pink-500'}`}></div>
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <div className={`p-2 sm:p-2.5 md:p-3 rounded border ${isDayTheme ? 'bg-slate-100 border-slate-300' : 'bg-cyan-950/50 border-cyan-500/20'}`}>
            <TomorrowIcon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${TomorrowIconData.color}`} />
          </div>
          <div>
            <div className={`text-[9px] sm:text-[10px] uppercase tracking-widest mb-1 ${styles.textHighlight}`}>TOMORROW</div>
            <div className={`text-sm sm:text-base md:text-lg font-bold ${styles.textMain} break-words`}>{TomorrowIconData.label}</div>
          </div>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <span className={`block text-xl sm:text-2xl md:text-3xl font-bold ${styles.textMain}`}>{convertTemp(weather.daily.temperature_2m_max[1], unit)}°</span>
          <span className={`text-[10px] sm:text-xs font-mono ${styles.textMuted}`}>
            LO:{convertTemp(weather.daily.temperature_2m_min[1], unit)}° HI:{convertTemp(weather.daily.temperature_2m_max[1], unit)}°
          </span>
        </div>
      </div>
    </div>
  );
};