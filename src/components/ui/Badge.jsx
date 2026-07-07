import React from 'react';

const VARIANTS = {
  high: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  neutral: 'bg-white/5 text-zinc-400 border border-white/10',
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={`font-mono text-[0.6rem] font-semibold tracking-wider px-2 py-0.5 rounded ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
};
