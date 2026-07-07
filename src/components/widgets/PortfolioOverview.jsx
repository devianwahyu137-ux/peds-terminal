import React from 'react';
import { Card } from '../ui/Card';
import { Wallet, TrendingUp, PieChart } from 'lucide-react';

const PortfolioOverview = () => {
  return (
    <Card className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2 text-text-secondary">
          <Wallet size={16} />
          <h3 className="section-header">Portfolio Overview</h3>
        </div>
        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[0.6rem] text-text-muted">
          ACCOUNT: <span className="text-zinc-300">MARGIN-01</span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Total Equity Section */}
        <div className="mb-6 relative shrink-0">
          <p className="font-mono text-[0.65rem] text-text-muted mb-1 tracking-widest uppercase">Total Equity (USD)</p>
          <div className="flex items-end gap-3">
            <span className="font-mono text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              $142,850.00
            </span>
            <span className="font-mono text-sm text-emerald-400 font-bold mb-1 px-2 py-0.5 bg-emerald-500/10 rounded-md">
              +1.24%
            </span>
          </div>
          
          {/* Mock Equity Curve Background */}
          <div className="absolute top-8 left-0 right-0 h-16 pointer-events-none opacity-20">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-emerald-500 fill-emerald-500/10">
              <path d="M0,30 L0,20 C20,25 30,10 50,15 C70,20 80,5 100,2 L100,30 Z" />
              <path d="M0,20 C20,25 30,10 50,15 C70,20 80,5 100,2" fill="none" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 shrink-0">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="font-mono text-[0.65rem] text-text-secondary uppercase tracking-wider">Today's PnL</span>
            </div>
            <p className="font-mono text-base font-bold text-emerald-400">+$1,765.20</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <PieChart size={14} className="text-accent-purple" />
              <span className="font-mono text-[0.65rem] text-text-secondary uppercase tracking-wider">Margin Used</span>
            </div>
            <p className="font-mono text-base font-bold text-white">18.4%</p>
          </div>
        </div>

        {/* Active Positions */}
        <div className="pt-2 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">Active Positions</span>
            <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">3</span>
          </div>
          <div className="space-y-2">
            {['BTC-PERP', 'ETH-PERP', 'SOL-PERP'].map((pos, idx) => (
              <div key={pos} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                <span className="font-mono text-sm font-bold text-accent-blue">{pos}</span>
                <span className={`font-mono text-sm font-medium ${idx === 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {idx === 2 ? '-$120.00' : '+$450.00'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Asset Allocation */}
        <div className="mt-6 border-t border-white/5 pt-5 shrink-0">
          <h4 className="font-mono text-[0.65rem] text-text-secondary uppercase tracking-wider mb-4">Asset Allocation</h4>
          <div className="flex items-center gap-6">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="45 100" />
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-45" />
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75" />
              </svg>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-mono text-zinc-400">BTC</span></div>
                <span className="text-xs font-mono font-bold text-white mt-0.5">45%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[10px] font-mono text-zinc-400">ETH</span></div>
                <span className="text-xs font-mono font-bold text-white mt-0.5">30%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-mono text-zinc-400">SOL</span></div>
                <span className="text-xs font-mono font-bold text-white mt-0.5">15%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-600"></div><span className="text-[10px] font-mono text-zinc-400">OTHER</span></div>
                <span className="text-xs font-mono font-bold text-white mt-0.5">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Recent Activity */}
        <div className="mt-6 border-t border-white/5 pt-5 pb-2 shrink-0">
          <h4 className="font-mono text-[0.65rem] text-text-secondary uppercase tracking-wider mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { type: 'BUY', sym: 'SOL/USDT', amt: '$4,250', time: '12m ago', color: 'emerald' },
              { type: 'SELL', sym: 'BTC/USDT', amt: '$12,400', time: '1h ago', color: 'rose' },
              { type: 'FEE', sym: 'Funding', amt: '-$14.20', time: '4h ago', color: 'zinc' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded bg-${log.color}-500/10 text-${log.color}-500 flex items-center justify-center font-bold text-[10px]`}>
                    {log.type.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white">{log.sym}</span>
                    <span className="text-[10px] font-mono text-text-muted">{log.type} Order</span>
                  </div>
                </div>
                <div className="text-right flex flex-col">
                  <span className={`text-xs font-mono font-bold ${log.type === 'SELL' || log.type === 'FEE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {log.amt}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PortfolioOverview;
