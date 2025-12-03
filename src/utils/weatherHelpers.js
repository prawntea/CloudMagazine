/**
 * Weather Description Helper
 * Maps weather codes to icons, labels, and colors based on day/night
 */
import { Cloud } from 'lucide-react';
import { WEATHER_CODES } from '../constants/weatherCodes';

export const getWeatherDescription = (code, isDay = 1) => {
  // Get weather info or use default for unknown codes
  const weatherInfo = WEATHER_CODES[code] || { 
    label: 'UNKNOWN', 
    icon: Cloud, 
    color: 'text-gray-400' 
  };

  // Select appropriate icon and color based on day/night
  const icon = isDay ? (weatherInfo.icon || weatherInfo.iconNight) : (weatherInfo.iconNight || weatherInfo.icon);
  const color = isDay ? weatherInfo.color : (weatherInfo.colorNight || weatherInfo.color);

  return {
    label: weatherInfo.label,
    icon,
    color
  };
};