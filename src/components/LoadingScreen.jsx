/**
 * LoadingScreen Component
 * Displays a loading spinner while weather data is being fetched
 */
export const LoadingScreen = () => (
  <div className="min-h-screen bg-black text-cyan-500 font-mono flex flex-col items-center justify-center p-4">
    <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
    <div className="text-sm tracking-widest animate-pulse">CONNECTING...</div>
  </div>
);