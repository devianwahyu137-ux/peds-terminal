import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Newspaper, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NEWS = [
  { id: 1, title: 'Dow builds on 53,000 record, chip stocks fall as investors rotate bets', source: 'CNBC', time: '2h ago', impact: 'HIGH', category: 'macro', url: '#' },
  { id: 2, title: 'BlackRock CEO says Bitcoin is "digital gold", expects continued adoption', source: 'Bloomberg', time: '3h ago', impact: 'HIGH', category: 'crypto', url: '#' },
  { id: 3, title: 'Federal Reserve hints at potential rate cut in Q3 2026', source: 'Reuters', time: '5h ago', impact: 'HIGH', category: 'macro', url: '#' },
  { id: 4, title: 'Solana DeFi TVL crosses $10B mark, driven by new lending protocols', source: 'CoinDesk', time: '7h ago', impact: 'MED', category: 'crypto', url: '#' },
  { id: 5, title: 'EU lawmakers finalize MiCA stablecoin regulations', source: 'CoinTelegraph', time: '8h ago', impact: 'MED', category: 'crypto', url: '#' },
  { id: 6, title: 'Oil prices rise after geopolitical tensions escalate in Middle East', source: 'Yahoo Finance', time: '10h ago', impact: 'LOW', category: 'macro', url: '#' },
];

const NewsFeed = () => {
  const [filter, setFilter] = useState('all');

  const filteredNews = MOCK_NEWS.filter(news => filter === 'all' || news.category === filter);

  return (
    <Card className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <Newspaper size={16} />
          <h3 className="section-header">Live Intelligence Feed</h3>
        </div>
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
          {['all', 'crypto', 'macro'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md font-mono text-[0.65rem] uppercase tracking-wider transition-all duration-200 ${
                filter === f 
                  ? 'bg-accent-blue/20 text-accent-blue font-bold shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNews.map((news) => (
            <motion.a
              href={news.url}
              key={news.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="font-sans text-sm font-medium leading-snug text-zinc-200 group-hover:text-white transition-colors">
                  {news.title}
                </h4>
                <ExternalLink size={14} className="text-zinc-600 group-hover:text-accent-blue transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.6rem] text-accent-blue">{news.source}</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="font-mono text-[0.6rem] text-zinc-500">{news.time}</span>
                </div>
                <Badge variant={news.impact === 'HIGH' ? 'high' : news.impact === 'MED' ? 'amber' : 'neutral'}>
                  {news.impact}
                </Badge>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default NewsFeed;
