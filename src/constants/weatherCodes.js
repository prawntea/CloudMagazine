/**
 * Weather Codes Mapping
 * Maps WMO weather codes to icons, labels, and colors for day/night themes
 * Based on WMO Weather Interpretation Codes (WW)
 */
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

export const WEATHER_CODES = {
  0: { label: 'CLEAR SKY', icon: Sun, iconNight: Moon, color: 'text-orange-500 drop-shadow-md', colorNight: 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
  1: { label: 'MAINLY CLEAR', icon: Sun, iconNight: Moon, color: 'text-orange-400', colorNight: 'text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]' },
  2: { label: 'PARTLY CLOUDY', icon: Cloud, color: 'text-blue-500', colorNight: 'text-cyan-200' },
  3: { label: 'OVERCAST', icon: Cloud, color: 'text-slate-400', colorNight: 'text-slate-400' },
  45: { label: 'FOG', icon: Cloud, color: 'text-slate-400', colorNight: 'text-slate-400' },
  48: { label: 'RIME FOG', icon: Cloud, color: 'text-slate-400', colorNight: 'text-slate-400' },
  51: { label: 'LIGHT DRIZZLE', icon: CloudRain, color: 'text-blue-400', colorNight: 'text-blue-400' },
  53: { label: 'MODERATE DRIZZLE', icon: CloudRain, color: 'text-blue-500', colorNight: 'text-blue-500' },
  55: { label: 'DENSE DRIZZLE', icon: CloudRain, color: 'text-blue-600', colorNight: 'text-blue-600' },
  61: { label: 'SLIGHT RAIN', icon: CloudRain, color: 'text-blue-500', colorNight: 'text-blue-500' },
  63: { label: 'MODERATE RAIN', icon: CloudRain, color: 'text-blue-600', colorNight: 'text-blue-600' },
  65: { label: 'HEAVY RAIN', icon: CloudRain, color: 'text-blue-700', colorNight: 'text-blue-700' },
  71: { label: 'SLIGHT SNOW', icon: CloudSnow, color: 'text-slate-600', colorNight: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' },
  73: { label: 'MODERATE SNOW', icon: CloudSnow, color: 'text-slate-700', colorNight: 'text-white' },
  75: { label: 'HEAVY SNOW', icon: CloudSnow, color: 'text-slate-800', colorNight: 'text-white' },
  95: { label: 'THUNDERSTORM', icon: CloudLightning, color: 'text-purple-500', colorNight: 'text-purple-500' },
};