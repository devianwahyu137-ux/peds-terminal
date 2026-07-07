import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  const categories = ['All', 'DeFi', 'Layer 1', 'Layer 2', 'AI', 'RWA'];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full p-1 border-b border-white/5 pb-4 mb-4">
      
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[0.65rem] uppercase tracking-wider transition-all duration-200 border ${
              activeCategory === cat 
                ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/50 shadow-[0_0_10px_rgba(96,165,250,0.2)]' 
                : 'bg-white/5 text-zinc-400 border-transparent hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Advanced Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search symbol..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
        <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
          <SlidersHorizontal size={14} />
        </button>
      </div>

    </div>
  );
};

export default FilterBar;
