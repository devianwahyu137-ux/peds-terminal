import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Clock, Wifi, Shield, ChevronDown } from 'lucide-react';
import IntelligenceHub from './IntelligenceHub';
import MarketVisualizer from './MarketVisualizer';
import RiskEngine from './RiskEngine';

/* Header height constant for offset calculations */
const HEADER_H = 44;

/* ═══════════════════════════════════════════
   SYMBOL DROPDOWN
   ═══════════════════════════════════════════ */
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1 rounded-md glass-elevated hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
      >
        <span className="font-mono text-xs font-bold text-accent-blue tracking-wider">
          {current.label}
        </span>
        <span className="font-mono text-[0.55rem] text-text-secondary">
          /USDT
        </span>
        <ChevronDown
          size={12}
          className={`text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full lg:top-full lg:bottom-auto left-0 mb-1 lg:mt-1 lg:mb-0 z-50 glass-elevated rounded-lg overflow-hidden min-w-[160px]"
            style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            {symbols.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSymbol(s.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-150 cursor-pointer ${
                  s.id === activeSymbol
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{s.label}</span>
                  <span className="font-mono text-[0.5rem] text-text-muted">{s.name}</span>
                </div>
                {s.id === activeSymbol && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════
   DASHBOARD SHELL
   Sticky header + safe-scrolling mobile layout
   ═══════════════════════════════════════════ */
const DashboardShell = ({ symbols, activeSymbol, setActiveSymbol }) => {
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
    <div className="min-h-screen w-full bg-terminal-bg flex flex-col relative">
      {/* ── Navigation Bar (Bottom on Mobile, Top on Desktop) ── */}
      <motion.header
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-0 lg:top-0 lg:bottom-auto left-0 right-0 z-50 flex items-center justify-between px-3 lg:px-5 flex-shrink-0"
        style={{
          height: `${HEADER_H}px`,
          background: 'rgba(5,5,5,0.97)',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: Brand + Dropdown */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse-glow" />
            <span className="font-mono text-xs lg:text-sm font-bold tracking-wider gradient-text-brand">
              PEDS TERMINAL
            </span>
            <span className="font-mono text-[0.55rem] text-text-muted tracking-widest hidden sm:inline">
              v1.0
            </span>
          </div>
          <div className="h-4 w-px bg-border-dim hidden sm:block" />
          <SymbolDropdown
            symbols={symbols}
            activeSymbol={activeSymbol}
            setActiveSymbol={setActiveSymbol}
          />
        </div>

        {/* Center: Status (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity size={11} className="text-accent-emerald" />
            <span className="font-mono text-[10px] text-text-secondary tracking-wide">
              MARKET OPEN
            </span>
          </div>
          <div className="h-3 w-px bg-border-dim" />
          <div className="flex items-center gap-1.5">
            <Wifi size={11} className="text-accent-emerald" />
            <span className="font-mono text-[10px] text-text-secondary tracking-wide">
              CONNECTED
            </span>
          </div>
          <div className="h-3 w-px bg-border-dim" />
          <div className="flex items-center gap-1.5">
            <Zap size={11} className="text-accent-amber" />
            <span className="font-mono text-[10px] text-accent-amber tracking-wide">
              24/7 CRYPTO
            </span>
          </div>
        </div>

        {/* Right: Clock */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <Shield size={10} className="text-accent-emerald" />
            <span className="font-mono text-[10px] text-text-muted tracking-wider">DSS</span>
          </div>
          <div className="h-3 w-px bg-border-dim hidden sm:block" />
          <div className="hidden lg:flex items-center gap-1.5">
            <Clock size={11} className="text-text-secondary" />
            <span className="font-mono text-[10px] text-text-secondary tracking-wide">
              {formatDate(currentTime)}
            </span>
          </div>
          <div className="glass-elevated rounded-md px-2 lg:px-3 py-1">
            <span className="font-mono text-[0.65rem] lg:text-xs font-semibold text-accent-blue tracking-wider">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </motion.header>

      {/* ── Content: Responsive Layout ── */}
      <div 
        className="flex flex-col space-y-8 p-4 bg-black min-h-screen lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6 w-full overflow-y-visible pb-[60px] lg:pb-6 pt-4 lg:pt-[60px] scroll-smooth"
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* MarketVisualizer: Center Column (lg:col-span-6) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-6 space-y-6 flex flex-col order-1 lg:order-2 w-full min-h-0"
        >
          <MarketVisualizer activeSymbol={activeSymbol} />
        </motion.div>

        {/* RiskEngine: Right Column (lg:col-span-3) */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 space-y-6 flex flex-col order-2 lg:order-3 w-full min-h-0"
        >
          <RiskEngine />
        </motion.div>

        {/* IntelligenceHub: Left Column (lg:col-span-3) */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3 space-y-6 flex flex-col order-3 lg:order-1 w-full min-h-0"
        >
          <IntelligenceHub />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardShell;
