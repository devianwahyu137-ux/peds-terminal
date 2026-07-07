import React, { useEffect, useRef } from 'react';
import { BarChart3, Layers } from 'lucide-react';

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
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const MarketVisualizer = ({ activeSymbol }) => {
  const symbolLabel = activeSymbol.replace('USDT', '') + ' / USDT';

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-accent-blue" />
          <span className="font-sans font-bold uppercase text-sm">
            {symbolLabel}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
          <Layers size={10} className="text-zinc-400" />
          <span className="font-mono text-[0.6rem] text-zinc-400">BINANCE</span>
        </div>
      </div>
      <div className="flex-1 min-h-[400px]">
        <AdvancedChartWidget key={activeSymbol} symbol={activeSymbol} />
      </div>
    </div>
  );
};

export default MarketVisualizer;
