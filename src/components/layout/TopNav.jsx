import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, Wifi, Zap, Clock, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';

const SymbolDropdown = ({ symbols, activeSymbol, setActiveSymbol }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = symbols.find((s) => s.id === activeSymbol) || symbols[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
      >
        <span className="font-mono text-sm font-bold text-accent-blue tracking-wider">
          {current.label}
        </span>
        <span className="font-mono text-xs text-text-secondary">
          /USDT
        </span>
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 glass-elevated rounded-xl overflow-hidden min-w-[180px]"
          >
            {symbols.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSymbol(s.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-150 cursor-pointer border-b border-white/5 last:border-0 ${
                  s.id === activeSymbol
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-mono text-xs font-bold">{s.label}</span>
                  <span className="font-sans text-[0.6rem] text-text-muted">{s.name}</span>
                </div>
                {s.id === activeSymbol && (
                  <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TopNav = ({ symbols, activeSymbol, setActiveSymbol }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const formatDate = (date) =>
    date
      .toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .toUpperCase();

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 shrink-0 relative z-30">
      
      {/* Left: Symbol Selector */}
      <div className="flex items-center gap-4">
        <SymbolDropdown
          symbols={symbols}
          activeSymbol={activeSymbol}
          setActiveSymbol={setActiveSymbol}
        />
        <div className="h-6 w-px bg-white/10 hidden sm:block" />
        <Badge variant="emerald" className="hidden sm:inline-flex">
          LIVE DATA
        </Badge>
      </div>

      {/* Center: System Status */}
      <div className="hidden md:flex items-center gap-6 glass px-4 py-1.5 rounded-full border border-white/5">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-emerald-400" />
          <span className="font-mono text-[0.65rem] text-zinc-400 font-medium">MARKET OPEN</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-emerald-400" />
          <span className="font-mono text-[0.65rem] text-zinc-400 font-medium">CONNECTED</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-amber-400" />
          <span className="font-mono text-[0.65rem] text-amber-400 font-medium">24/7 CRYPTO</span>
        </div>
      </div>

      {/* Right: Clock & DSS */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-zinc-500">
          <Shield size={12} />
          <span className="font-mono text-[0.65rem] font-bold">DSS ENGINE</span>
        </div>
        <div className="h-6 w-px bg-white/10 hidden lg:block" />
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <Clock size={12} />
            <span className="font-mono text-[0.65rem] font-medium">{formatDate(currentTime)}</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <span className="font-mono text-[0.7rem] font-bold text-accent-blue tracking-widest">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
