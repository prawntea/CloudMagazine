/**
 * SearchPanel Component
 * Left sidebar containing search input, location candidates, and saved favorites
 */
import { Search, Star, ArrowRight, Radio } from 'lucide-react';

export const SearchPanel = ({
  query,
  setQuery,
  handleSearch,
  loading,
  locationCandidates,
  selectLocation,
  favorites,
  fetchSingleLocation,
  isDayTheme,
  styles
}) => {
  return (
    <div className="md:col-span-4 space-y-3 sm:space-y-4">
      <div className={`p-3 sm:p-4 md:p-5 relative group overflow-hidden border ${styles.panel}`}>
        {/* Decorative corner markers for tech aesthetic */}
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
          {/* Header showing current list type and count */}
          <div className={`flex justify-between items-end border-b pb-2 mb-4 ${styles.border}`}>
            <h3 className={`text-xs font-bold flex items-center gap-2 ${styles.textAccent}`}>
              <Radio className="h-3 w-3 animate-pulse" />
              {locationCandidates.length > 0 ? 'SELECT LOCATION' : 'SAVED PLACES'}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDayTheme ? 'bg-slate-200 text-slate-600' : 'bg-cyan-950 text-cyan-800'}`}>
              COUNT: {locationCandidates.length > 0 ? locationCandidates.length.toString().padStart(2, '0') : favorites.length.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Scrollable list area */}
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className={`text-xs border border-dashed p-4 text-center ${styles.textMuted} ${styles.border}`}>
                SEARCHING...
              </div>
            ) : locationCandidates.length > 0 ? (
              // Display search candidates when available
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
              // Empty state when no favorites exist
              <div className={`text-xs border border-dashed p-4 text-center ${styles.textMuted} ${styles.border}`}>
                NO DATA
              </div>
            ) : (
              // Display saved favorites
              favorites.map(city => (
                <button
                  key={city}
                  onClick={() => fetchSingleLocation(city)}
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
    </div>
  );
};