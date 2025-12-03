/**
 * Temperature Conversion Utility
 * Converts Celsius to Fahrenheit or returns Celsius rounded
 */
export const convertTemp = (tempC, unit) => {
  if (unit === 'c') return Math.round(tempC);
  return Math.round((tempC * 9/5) + 32);
};