/**
 * Style Constants
 * Theme-based style objects for day and night modes
 */

// Light theme styles (day mode)
export const getDayStyles = () => ({
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
});

// Dark theme styles (night mode)
export const getNightStyles = () => ({
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
});

// Returns appropriate style object based on theme
export const getStyles = (isDayTheme) => isDayTheme ? getDayStyles() : getNightStyles();