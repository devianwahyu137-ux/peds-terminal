import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Layers, Activity, LayoutGrid,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   TRADINGVIEW: Advanced Chart (tracks activeSymbol)
   ═══════════════════════════════════════════ */
const AdvancedChartWidget = ({ symbol }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: `BINANCE:${symbol}`, interval: '60',
      timezone: 'Etc/UTC', theme: 'dark', style: '1', locale: 'en',
      backgroundColor: 'rgba(5, 5, 5, 1)', gridColor: 'rgba(255, 255, 255, 0.03)',
      hide_side_toolbar: false, allow_symbol_change: true, calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    container.appendChild(script);
    return () => { if (container) container.innerHTML = ''; };
  }, [symbol]);
  return (
    <div className="tradingview-widget-container w-full h-full" ref={containerRef} title="TradingView Chart">
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

/* ═══════════════════════════════════════════
   TRADINGVIEW: Crypto Screener
   ═══════════════════════════════════════════ */
const CryptoScreenerWidget = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%', height: '100%', defaultColumn: 'overview',
      screener_type: 'crypto_mkt', displayCurrency: 'USD',
      colorTheme: 'dark', locale: 'en', isTransparent: true,
    });
    container.appendChild(script);
    return () => { if (container) container.innerHTML = ''; };
  }, []);
  return (
    <div className="tradingview-widget-container w-full h-full" ref={containerRef} title="Crypto Screener">
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

const MarketPulseBar = lazy(() => import('./MarketPulseBar'));

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const MarketVisualizer = ({ activeSymbol }) => {
  const symbolLabel = activeSymbol.replace('USDT', '') + ' / USDT';

  return (
    <>
      {/* ── Advanced Chart ──
           px-6 on mobile creates a "Safe Zone" for thumb scrolling
           without triggering TradingView chart drag/zoom */}
      <div className="h-[500px] lg:h-[600px] bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-5 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <BarChart3 size={13} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
              {symbolLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-text-muted" />
            <span className="font-mono text-[10px] lg:text-[0.55rem] text-text-muted">BINANCE</span>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-6 lg:px-0">
          <AdvancedChartWidget key={activeSymbol} symbol={activeSymbol} />
        </div>
      </div>

      {/* ── Crypto Sector Performance (Screener) ── */}
      <div className="h-[400px] lg:h-[500px] bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-5 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <LayoutGrid size={12} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
              CRYPTO SECTOR PERFORMANCE
            </span>
          </div>
          <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-muted">TOP MOVERS</span>
        </div>
        <div className="flex-1 min-h-0">
          <CryptoScreenerWidget />
        </div>
      </div>

      {/* ── Market Pulse Bar ── */}
      <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-5 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <Activity size={12} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
              MARKET PULSE
            </span>
          </div>
          <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-muted">LIVE SENTIMENT</span>
        </div>
        <div className="min-h-[94px] flex items-center py-2 lg:py-0">
          <Suspense fallback={<div className="flex justify-center w-full font-mono text-xs text-text-muted">LOADING PULSE...</div>}>
            <MarketPulseBar />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default MarketVisualizer;
