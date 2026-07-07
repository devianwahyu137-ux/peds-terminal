import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

const TopMoversMini = () => {
  const movers = [
    { sym: 'SOL', name: 'Solana', price: '$145.80', change: '+12.5%', isUp: true },
    { sym: 'RNDR', name: 'Render', price: '$8.40', change: '+18.4%', isUp: true },
    { sym: 'PENDLE', name: 'Pendle', price: '$4.20', change: '-8.2%', isUp: false },
    { sym: 'LINK', name: 'Chainlink', price: '$18.20', change: '-1.5%', isUp: false },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Top Movers (24H)" icon={Activity} />
      
      <div className="flex-1 flex flex-col gap-2 mt-2">
        {movers.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-white">{m.sym}</span>
              <span className="font-sans text-[10px] text-zinc-500">{m.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-xs text-zinc-300">{m.price}</span>
              <div className={`flex items-center gap-1 font-mono text-[10px] font-bold ${m.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {m.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopMoversMini;
