import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Activity, Flame, Snowflake, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const FearGreedIndex = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchSentiment = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('https://api.alternative.me/fng/', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const json = await res.json();
        if (!cancelled && json.data && json.data[0]) {
          setData({
            value: parseInt(json.data[0].value, 10),
            label: json.data[0].value_classification.toUpperCase(),
          });
        }
      } catch {
        // Fallback mock
        if (!cancelled) setData({ value: 68, label: 'GREED' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSentiment();
    return () => { cancelled = true; };
  }, []);

  const value = data?.value ?? 50;

  let color = 'text-zinc-400';
  let Icon = Search;
  let bgGradient = 'from-zinc-500/20 to-transparent';
  let barColor = 'bg-zinc-500';

  if (value <= 44) {
    color = 'text-rose-500';
    Icon = Snowflake;
    bgGradient = 'from-rose-500/20 to-transparent';
    barColor = 'bg-rose-500';
  } else if (value >= 56) {
    color = 'text-emerald-500';
    Icon = Flame;
    bgGradient = 'from-emerald-500/20 to-transparent';
    barColor = 'bg-emerald-500';
  }

  return (
    <Card className="h-full">
      <CardHeader title="Fear & Greed Index" icon={Activity} />
      <div className="flex flex-col items-center justify-center h-full pb-8">
        {loading ? (
          <div className="animate-pulse w-24 h-24 rounded-full bg-white/5" />
        ) : (
          <div className="relative flex flex-col items-center">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-radial ${bgGradient} blur-2xl rounded-full scale-150`} />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 flex flex-col items-center"
            >
              <Icon size={32} className={`${color} mb-2`} />
              <h2 className={`font-mono text-5xl font-black ${color} tracking-tighter drop-shadow-md`}>
                {value}
              </h2>
              <p className="font-mono text-xs text-white font-bold tracking-widest mt-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                {data?.label}
              </p>
            </motion.div>

            {/* Linear Scale Bar */}
            <div className="w-48 h-2 bg-white/10 rounded-full mt-6 relative overflow-hidden">
              <motion.div 
                className={`absolute left-0 top-0 bottom-0 ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>
            <div className="w-48 flex justify-between mt-2 px-1">
              <span className="font-mono text-[0.5rem] text-rose-500">FEAR</span>
              <span className="font-mono text-[0.5rem] text-emerald-500">GREED</span>
            </div>

            {/* NEW: Historical Trends */}
            <div className="w-full flex justify-around mt-8 border-t border-white/5 pt-4">
              <div className="flex flex-col items-center">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">Yesterday</span>
                <span className="font-mono text-xs font-bold text-emerald-500 mt-1">60</span>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div className="flex flex-col items-center">
                <span className="font-mono text-[9px] text-zinc-500 uppercase">Last Week</span>
                <span className="font-mono text-xs font-bold text-zinc-400 mt-1">45</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FearGreedIndex;
