/**
 * useLocalTime Hook
 * Calculates and updates local time, day phase, and progress for a given timezone
 */
import { useState, useEffect } from 'react';

export const useLocalTime = (timezone) => {
  const [timeData, setTimeData] = useState({ time: '', phase: '', progress: 0 });

  useEffect(() => {
    if (!timezone) return;

    // Update time, phase, and day progress
    const updateTime = () => {
      const now = new Date();
      // Format time in 12-hour format
      const options = { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      
      // Get 24-hour format for calculations
      const hour24 = parseInt(new Intl.DateTimeFormat('en-US', { 
        timeZone: timezone, 
        hour: 'numeric', 
        hour12: false 
      }).format(now), 10);
      const minute = now.getMinutes();
      
      // Calculate progress through the day (0-100%)
      const totalMinutes = (hour24 * 60) + minute;
      const progress = (totalMinutes / 1440) * 100;

      // Determine time of day phase
      let phase = 'NIGHT';
      if (hour24 >= 6 && hour24 < 12) phase = 'MORNING';
      else if (hour24 >= 12 && hour24 < 17) phase = 'AFTERNOON';
      else if (hour24 >= 17 && hour24 < 21) phase = 'EVENING';
      else if (hour24 >= 0 && hour24 < 3) phase = 'LATE NIGHT';
      else if (hour24 >= 3 && hour24 < 6) phase = 'EARLY MORNING';

      setTimeData({ time: timeString, phase, progress });
    };

    // Update immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return timeData;
};