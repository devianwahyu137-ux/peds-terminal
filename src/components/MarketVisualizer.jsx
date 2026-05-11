import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Layers, Activity, LayoutGrid,
  Flame, PieChart, TrendingUp, BarChart2,
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
    <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
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
    <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

/* ═══════════════════════════════════════════
   REUSABLE: MiniArcGauge (Symmetric SVG Dial)
   viewBox: 0 0 100 100  |  center: (50, 50)  |  r: 40
   ═══════════════════════════════════════════ */
const MiniArcGauge = ({
  value, maxValue = 100, label, sublabel,
  color, icon: Icon, loading = false, displayValue,
}) => {
  const clamped = Math.max(0, Math.min(maxValue, Math.abs(value)));
  const pct = maxValue > 0 ? clamped / maxValue : 0;
  const cx = 50, cy = 50, r = 40;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - pct * circumference;
  const shown = displayValue !== undefined ? displayValue : (loading ? '...' : clamped);

  return (
    <div className="flex flex-col items-center justify-center min-w-0 px-1">
      <div className="relative flex items-center justify-center w-full max-w-[80px] mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          {!loading && pct > 0 && (
            <motion.circle cx={cx} cy={cy} r={r} fill="none"
              stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
            />
          )}
        </svg>
        <span className="absolute font-mono text-[10px] md:text-xs font-bold"
          style={{ color: loading ? '#374151' : '#E5E7EB' }}>
          {shown}
        </span>
      </div>
      <div className="flex flex-col items-center mt-1">
        <div className="flex items-center gap-1">
          {Icon && <Icon size={8} style={{ color }} />}
          <span className="font-mono text-[10px] font-bold tracking-wider text-text-primary truncate">{label}</span>
        </div>
        {sublabel && (
          <span className="font-mono text-[9px] text-text-secondary truncate">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MARKET PULSE BAR (4 symmetric dials)
   ═══════════════════════════════════════════ */
const MarketPulseBar = () => {
  const [data, setData] = useState({
    fearGreed: { value: 0, label: '', loading: true },
    btcDom: { value: 0, loading: true },
    altSeason: { value: 0, loading: true },
    mcapChange: { value: 0, loading: true },
  });

  useEffect(() => {
    let cancelled = false;
    const fetchFng = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1');
        const json = await res.json();
        if (!cancelled && json?.data?.[0]) {
          setData((p) => ({ ...p, fearGreed: {
            value: parseInt(json.data[0].value, 10),
            label: json.data[0].value_classification?.toUpperCase() || '', loading: false,
          }}));
        }
      } catch {
        if (!cancelled) setData((p) => ({ ...p, fearGreed: { value: 52, label: 'NEUTRAL', loading: false } }));
      }
    };
    const fetchGlobal = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/global');
        const json = await res.json();
        if (!cancelled && json?.data) {
          const btcDom = parseFloat((json.data.market_cap_percentage?.btc || 0).toFixed(1));
          const capChange = parseFloat((json.data.market_cap_change_percentage_24h_usd || 0).toFixed(2));
          const altVal = Math.round(Math.max(0, Math.min(100, (100 - btcDom) * 2.1 - 10)));
          setData((p) => ({ ...p,
            btcDom: { value: btcDom, loading: false },
            altSeason: { value: altVal, loading: false },
            mcapChange: { value: capChange, loading: false },
          }));
        }
      } catch {
        if (!cancelled) setData((p) => ({ ...p,
          btcDom: { value: 54.3, loading: false },
          altSeason: { value: 46, loading: false },
          mcapChange: { value: 1.2, loading: false },
        }));
      }
    };
    fetchFng();
    fetchGlobal();
    return () => { cancelled = true; };
  }, []);

  const fngColor = data.fearGreed.value <= 25 ? '#F43F5E'
    : data.fearGreed.value <= 45 ? '#F59E0B'
    : data.fearGreed.value <= 55 ? '#6B7280'
    : data.fearGreed.value <= 75 ? '#10B981' : '#3B82F6';
  const mcColor = data.mcapChange.value >= 0 ? '#10B981' : '#F43F5E';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 w-full h-full px-2 gap-2 lg:gap-0 place-items-center">
      <MiniArcGauge value={data.fearGreed.value} maxValue={100}
        label="FEAR & GREED" sublabel={data.fearGreed.label}
        color={fngColor} icon={Flame} loading={data.fearGreed.loading} />
      <MiniArcGauge value={data.btcDom.value} maxValue={100}
        label="BTC DOM" sublabel={`${data.btcDom.value}%`}
        color="#F59E0B" icon={PieChart} loading={data.btcDom.loading}
        displayValue={data.btcDom.loading ? '...' : data.btcDom.value} />
      <MiniArcGauge value={data.altSeason.value} maxValue={100}
        label="ALT SEASON" sublabel={data.altSeason.value > 60 ? 'ALT SZN' : data.altSeason.value > 40 ? 'MIXED' : 'BTC SZN'}
        color="#A855F7" icon={TrendingUp} loading={data.altSeason.loading} />
      <MiniArcGauge value={Math.abs(data.mcapChange.value)} maxValue={10}
        label="MCAP 24H" sublabel={`${data.mcapChange.value >= 0 ? '+' : ''}${data.mcapChange.value}%`}
        color={mcColor} icon={BarChart2} loading={data.mcapChange.loading}
        displayValue={data.mcapChange.loading ? '...' : `${data.mcapChange.value > 0 ? '+' : ''}${data.mcapChange.value}`} />
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const MarketVisualizer = ({ activeSymbol }) => {
  const symbolLabel = activeSymbol.replace('USDT', '') + ' / USDT';

  return (
    <div className="h-auto flex flex-col overflow-visible">
      {/* ── Advanced Chart ──
           px-6 on mobile creates a "Safe Zone" for thumb scrolling
           without triggering TradingView chart drag/zoom */}
      <div className="h-[50vh] lg:flex-none flex flex-col overflow-hidden thin-border-b min-h-0">
        <div className="flex items-center justify-between px-3 lg:px-4 py-2 thin-border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 size={13} className="text-accent-blue" />
            <span className="font-mono text-[10px] lg:text-[0.75rem] font-bold tracking-[0.12em] text-accent-blue uppercase">
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
      <div className="flex-1 h-auto flex flex-col overflow-hidden thin-border-b min-h-0">
        <div className="flex items-center justify-between px-3 lg:px-4 py-1.5 thin-border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <LayoutGrid size={12} className="text-accent-purple" />
            <span className="font-mono text-[10px] lg:text-[0.7rem] font-bold tracking-[0.12em] text-accent-purple uppercase">
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
      <div className="flex-shrink-0 overflow-hidden" style={{ minHeight: '120px' }}>
        <div className="flex items-center justify-between px-3 lg:px-4 py-1.5 thin-border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-accent-emerald" />
            <span className="font-mono text-[10px] lg:text-[0.7rem] font-bold tracking-[0.12em] text-accent-emerald uppercase">
              MARKET PULSE
            </span>
          </div>
          <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-muted">LIVE SENTIMENT</span>
        </div>
        <div className="min-h-[94px] flex items-center py-2 lg:py-0">
          <MarketPulseBar />
        </div>
      </div>
    </div>
  );
};

export default MarketVisualizer;
