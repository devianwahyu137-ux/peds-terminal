import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ValueAtRiskGauge = () => {
  // Mock VaR Data
  const var95 = 2.45; // 2.45% of portfolio at risk
  const portfolioValue = 142850;
  const varDollar = (portfolioValue * (var95 / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Value at Risk (95% CI)" icon={ShieldAlert} />
      
      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Main Metric */}
        <div className="text-center relative">
          <p className="font-mono text-sm text-zinc-400 mb-1">Estimated Maximum Loss (24h)</p>
          <h2 className="font-mono text-4xl font-bold text-amber-500">
            ${varDollar}
          </h2>
          <p className="font-mono text-xs text-amber-500/70 font-semibold mt-1">
            {var95}% of Total Equity
          </p>
        </div>

        {/* Heatmap Bar */}
        <div className="w-full space-y-1 mt-4">
          <div className="flex justify-between font-mono text-[0.6rem] text-zinc-500 px-1">
            <span>Safe (0-1%)</span>
            <span>Warning (2-4%)</span>
            <span>Danger (5%+)</span>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-white/5 relative">
            <div className="h-full w-1/4 bg-emerald-500/50" />
            <div className="h-full w-2/4 bg-amber-500/50" />
            <div className="h-full w-1/4 bg-rose-500/50" />
            
            {/* Indicator */}
            <motion.div 
              initial={{ left: 0 }}
              animate={{ left: '35%' }}
              transition={{ type: 'spring', damping: 15 }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </div>
        </div>

        {/* NEW: Historical Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-6 border-t border-white/5 pt-6 shrink-0">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase">7-Day Avg VaR</span>
            <span className="font-mono text-sm font-bold text-white">$3,120</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase">30D Max Drawdown</span>
            <span className="font-mono text-sm font-bold text-rose-400">-15.4%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ValueAtRiskGauge;
