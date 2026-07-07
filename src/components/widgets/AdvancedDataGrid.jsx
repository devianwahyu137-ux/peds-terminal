import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DATA = [
  { id: 'BTC', name: 'Bitcoin', price: 67420.50, change1h: 0.12, change24h: 2.4, vol: '42.1B', mcap: '1.32T', cat: 'Layer 1', volMcap: 3.2 },
  { id: 'ETH', name: 'Ethereum', price: 3450.20, change1h: -0.05, change24h: 4.2, vol: '18.5B', mcap: '415B', cat: 'Layer 1', volMcap: 4.5 },
  { id: 'SOL', name: 'Solana', price: 145.80, change1h: 1.2, change24h: 12.5, vol: '5.2B', mcap: '68B', cat: 'Layer 1', volMcap: 7.6 },
  { id: 'LINK', name: 'Chainlink', price: 18.20, change1h: -0.2, change24h: -1.5, vol: '890M', mcap: '10.6B', cat: 'RWA', volMcap: 8.4 },
  { id: 'UNI', name: 'Uniswap', price: 11.45, change1h: 0.4, change24h: 5.8, vol: '450M', mcap: '6.8B', cat: 'DeFi', volMcap: 6.6 },
  { id: 'ARB', name: 'Arbitrum', price: 1.12, change1h: 0.1, change24h: 2.1, vol: '320M', mcap: '2.9B', cat: 'Layer 2', volMcap: 11.0 },
  { id: 'RNDR', name: 'Render', price: 8.40, change1h: -1.2, change24h: 18.4, vol: '1.2B', mcap: '3.2B', cat: 'AI', volMcap: 37.5 },
  { id: 'MKR', name: 'Maker', price: 2850.00, change1h: 0.8, change24h: 4.5, vol: '210M', mcap: '2.6B', cat: 'DeFi', volMcap: 8.1 },
];

// Reusable micro-sparkline component
const Sparkline = ({ isPositive }) => {
  const color = isPositive ? '#10b981' : '#f43f5e';
  // Randomize the path slightly just for the mock visual
  const pathData = isPositive 
    ? "M0,15 L5,12 L10,14 L15,8 L20,10 L25,5 L30,8 L35,2 L40,0"
    : "M0,2 L5,5 L10,4 L15,10 L20,8 L25,14 L30,12 L35,18 L40,20";
    
  return (
    <div className="w-10 h-5">
      <svg viewBox="0 0 40 20" className="w-full h-full" preserveAspectRatio="none">
        <path 
          d={pathData} 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

const AdvancedDataGrid = ({ categoryFilter, searchQuery = '' }) => {
  const filtered = MOCK_DATA.filter(d => {
    const matchCategory = categoryFilter === 'All' || d.cat === categoryFilter;
    const matchSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatChange = (val) => {
    const isPos = val >= 0;
    return (
      <span className={isPos ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
        {isPos ? '+' : ''}{val.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-zinc-500 font-mono text-[0.65rem] uppercase tracking-wider">
            <th className="pb-4 px-4 font-semibold">Asset</th>
            <th className="pb-4 px-4 font-semibold text-right">Price (USD)</th>
            <th className="pb-4 px-4 font-semibold text-right">1H Change</th>
            <th className="pb-4 px-4 font-semibold text-right">24H Change</th>
            <th className="pb-4 px-4 font-semibold text-center">7D Trend</th>
            <th className="pb-4 px-4 font-semibold text-right">24H Vol</th>
            <th className="pb-4 px-4 font-semibold text-right">Market Cap</th>
            <th className="pb-4 px-4 font-semibold text-right">Vol/MCap</th>
          </tr>
        </thead>
        <tbody className="font-mono text-sm">
          <AnimatePresence mode="popLayout">
            {filtered.map((row) => (
              <motion.tr 
                key={row.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-accent-blue transition-colors">{row.id}</span>
                    <span className="text-[0.65rem] text-zinc-500 font-sans">{row.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-medium text-zinc-200">
                  ${row.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: row.price < 2 ? 4 : 2 })}
                </td>
                <td className="py-4 px-4 text-right">
                  {formatChange(row.change1h)}
                </td>
                <td className="py-4 px-4 text-right">
                  {formatChange(row.change24h)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <Sparkline isPositive={row.change24h >= 0} />
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-zinc-400 font-semibold">
                  ${row.vol}
                </td>
                <td className="py-4 px-4 text-right text-zinc-400 font-semibold">
                  ${row.mcap}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-zinc-300 font-bold">{row.volMcap.toFixed(1)}%</span>
                    <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${row.volMcap > 10 ? 'bg-amber-400' : 'bg-blue-400'}`} 
                        style={{ width: `${Math.min(100, row.volMcap * 2)}%` }} 
                      />
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="8" className="py-12 text-center text-zinc-500 font-mono text-sm">
                No assets found matching criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdvancedDataGrid;
