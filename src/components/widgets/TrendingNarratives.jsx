import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Network, Zap, Cpu, ArrowUpRight } from 'lucide-react';

const TrendingNarratives = () => {
  const narratives = [
    { name: 'AI Tokens', perf: '+14.2%', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'RWA', perf: '+8.7%', icon: Network, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Layer 2', perf: '+5.4%', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Top Narratives" icon={Network} />
      
      <div className="flex-1 flex flex-col justify-around gap-2 mt-2">
        {narratives.map((nar, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${nar.bg} flex items-center justify-center`}>
                <nar.icon size={16} className={nar.color} />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{nar.name}</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Sector Index</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-400">{nar.perf}</span>
              <ArrowUpRight size={14} className="text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TrendingNarratives;
