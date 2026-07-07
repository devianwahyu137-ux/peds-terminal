import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Brain, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const SentimentSummary = () => {
  return (
    <Card className="h-full">
      <CardHeader title="AI Macro Sentiment" icon={Brain} />
      
      <div className="flex flex-col h-[calc(100%-2.5rem)]">
        {/* Main Score & Sparkline */}
        <div className="flex flex-col items-center justify-center py-4 mb-4 relative flex-1">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-emerald-500 blur-3xl mix-blend-screen" />
          </div>
          
          <div className="text-center z-10">
            <h2 className="text-6xl font-mono font-black text-white tracking-tighter drop-shadow-md">
              78<span className="text-xl text-zinc-500 font-sans font-bold">/100</span>
            </h2>
            <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase mt-1 font-bold bg-emerald-500/10 inline-block px-3 py-1 rounded-full border border-emerald-500/20">
              Strong Bullish
            </p>
          </div>

          {/* 7-Day Sparkline */}
          <div className="w-full h-12 mt-4 relative opacity-70">
            <div className="absolute top-0 left-2 text-[8px] font-mono text-zinc-500">7D TREND</div>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full stroke-emerald-500 fill-transparent stroke-[1.5] drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">
              <path d="M0,15 L15,18 L30,12 L45,14 L60,8 L75,10 L90,4 L100,2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0,15 L15,18 L30,12 L45,14 L60,8 L75,10 L90,4 L100,2 L100,20 L0,20 Z" fill="url(#sparkGradient)" stroke="none" />
              <defs>
                <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.2)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Factors */}
        <div className="space-y-2 mt-auto shrink-0">
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="font-mono text-xs text-zinc-300">ETF Inflows</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400">+Highly Positive</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-3">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="font-mono text-xs text-zinc-300">CPI Data Data</span>
            </div>
            <span className="font-mono text-xs font-bold text-rose-400">-Negative</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-blue-400" />
              <span className="font-mono text-xs text-zinc-300">Network Activity</span>
            </div>
            <span className="font-mono text-xs font-bold text-blue-400">Neutral</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SentimentSummary;
