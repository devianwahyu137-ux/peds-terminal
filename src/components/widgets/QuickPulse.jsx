import React from 'react';
import { Card } from '../ui/Card';
import { Activity, Globe, Flame, BarChart2 } from 'lucide-react';

const PulseItem = ({ label, value, subValue, icon: Icon, colorClass }) => (
  <div className="flex flex-col gap-1 p-3 lg:p-4 border-r border-white/5 last:border-0 w-full">
    <div className="flex items-center gap-1.5 text-text-secondary">
      <Icon size={12} className={colorClass} />
      <span className="font-mono text-[0.6rem] lg:text-[0.65rem] uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-sm lg:text-base font-bold text-white">{value}</span>
      {subValue && (
        <span className="font-mono text-[0.6rem] text-emerald-400 font-medium">{subValue}</span>
      )}
    </div>
  </div>
);

const QuickPulse = () => {
  return (
    <Card className="!p-0 overflow-hidden flex flex-row items-center w-full">
      <PulseItem 
        label="Global Cap" 
        value="$2.45T" 
        subValue="+2.1%" 
        icon={Globe} 
        colorClass="text-accent-blue" 
      />
      <PulseItem 
        label="24h Volume" 
        value="$84.2B" 
        icon={BarChart2} 
        colorClass="text-zinc-400" 
      />
      <PulseItem 
        label="BTC Dom" 
        value="52.4%" 
        subValue="+0.4%" 
        icon={Activity} 
        colorClass="text-accent-amber" 
      />
      <PulseItem 
        label="Top Gainer" 
        value="SOL" 
        subValue="+14%" 
        icon={Flame} 
        colorClass="text-rose-400" 
      />
    </Card>
  );
};

export default QuickPulse;
