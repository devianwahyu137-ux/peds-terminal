import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Target,
  Brain,
  Gauge,
  TrendingUp,
  AlertTriangle,
  Percent,
  DollarSign,
  Crosshair,
  OctagonX,
  Activity,
  Info,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   QUANT MATH
   ═══════════════════════════════════════════ */

const calcPositionSize = (equity, riskPct, entry, stopLoss) => {
  const diff = Math.abs(entry - stopLoss);
  if (diff === 0 || equity <= 0 || riskPct <= 0) return { positionSize: 0, dollarRisk: 0, units: 0 };
  const dollarRisk = equity * (riskPct / 100);
  const units = dollarRisk / diff;
  const positionSize = units * entry;
  return { positionSize, dollarRisk, units };
};

const calcKelly = (winRate, rrRatio) => {
  if (rrRatio <= 0 || winRate <= 0 || winRate >= 1) return 0;
  const p = winRate;
  const q = 1 - p;
  const kelly = (rrRatio * p - q) / rrRatio;
  return Math.max(0, kelly);
};

const calcRiskOfRuin = (winRate, rrRatio, riskPct) => {
  if (riskPct <= 0 || winRate <= 0 || winRate >= 1) return 0;
  const p = winRate;
  const q = 1 - p;
  const edge = p * rrRatio - q;
  if (edge <= 0) return 1;
  const N = 100 / riskPct;
  const ror = Math.pow((1 - edge) / (1 + edge), N);
  return Math.min(1, Math.max(0, ror));
};

/* ═══════════════════════════════════════════
   LOCAL STORAGE
   ═══════════════════════════════════════════ */
const STORAGE_KEY = 'peds_risk_inputs';

const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
};

/* ═══════════════════════════════════════════
   TRADINGVIEW: Technical Analysis Gauge
   Hardcoded to BINANCE:BTCUSDT
   ═══════════════════════════════════════════ */
const TechGaugeWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: '1h',
      width: '100%',
      isTransparent: true,
      height: '100%',
      symbol: 'BINANCE:BTCUSDT',
      showIntervalTabs: true,
      displayMode: 'single',
      locale: 'en',
      colorTheme: 'dark',
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
   BITCOIN SENTIMENT (Richter Scale / Fear & Greed)
   ═══════════════════════════════════════════ */
const BitcoinSentiment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSentiment = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch('https://api.alternative.me/fng/');
        const json = await res.json();
        if (!cancelled && json.data && json.data[0]) {
          setData({
            value: parseInt(json.data[0].value, 10),
            label: json.data[0].value_classification.toUpperCase(),
          });
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 300000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const value = data?.value ?? 50;

  const getValueColor = (v) => {
    if (v <= 44) return '#EF4444';
    if (v <= 55) return '#A1A1AA';
    return '#10B981';
  };

  const needleColor = getValueColor(value);

  const getZoneLabel = (v) => {
    if (v <= 44) return 'FEAR';
    if (v <= 55) return 'NEUTRAL';
    return 'GREED';
  };

  const getZoneSide = (v) => {
    if (v <= 44) return 'BAD';
    if (v <= 55) return 'NEUTRAL';
    return 'GOOD';
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
          <Activity size={13} className="text-emerald-500" />
          <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
            BTC SENTIMENT
          </span>
        </div>
        <span className="font-mono text-[10px] lg:text-[0.55rem] text-text-secondary">
          FEAR &amp; GREED
        </span>
      </div>

      {/* Loading State */}
      {loading && !data && (
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border border-t-transparent rounded-full"
              style={{ borderColor: '#F7931A', borderTopColor: 'transparent' }}
            />
            <span className="font-mono text-[10px] text-text-secondary">FETCHING LIVE DATA...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !data && (
        <div className="flex items-center justify-center py-3">
          <span className="font-mono text-[10px] text-accent-rose">SIGNAL LOST</span>
        </div>
      )}

      {/* Richter Scale Gauge */}
      {(!loading || data) && !error && (
        <>
          <div className="relative w-full" style={{ height: '28px' }}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-full rounded-full overflow-hidden"
              style={{ height: '6px' }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(to right, #EF4444 0%, #F97316 25%, #A1A1AA 50%, #34D399 75%, #10B981 100%)',
                }}
              />
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1px',
                height: '14px',
                background: 'rgba(255,255,255,0.2)',
              }}
            />

            {[0, 25, 75, 100].map((tick) => (
              <div
                key={tick}
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `${tick}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '1px',
                  height: '10px',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
            ))}

            <motion.div
              initial={{ left: '50%' }}
              animate={{ left: `${value}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 15, duration: 1.2 }}
              className="absolute top-1/2"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '20px',
                  height: '20px',
                  background: `radial-gradient(circle, ${needleColor}33 0%, transparent 70%)`,
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  width: '2px',
                  height: '20px',
                  top: '-10px',
                  background: needleColor,
                  borderRadius: '1px',
                  boxShadow: `0 0 6px ${needleColor}88`,
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  background: needleColor,
                  boxShadow: `0 0 8px ${needleColor}`,
                }}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-accent-rose tracking-wider">FEAR</span>
            <span className="font-mono text-[10px] text-text-muted tracking-wider">NEUTRAL</span>
            <span className="font-mono text-[10px] text-accent-emerald tracking-wider">GREED</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="glass rounded-md px-3 py-1.5 flex items-center gap-2"
                 style={{ border: `0.5px solid ${needleColor}33` }}>
              <span className="font-mono text-sm lg:text-base font-bold" style={{ color: needleColor }}>
                {value}
              </span>
              <span className="font-mono text-[10px] text-text-muted">/</span>
              <span className="font-mono text-[10px] lg:text-[0.65rem] font-semibold tracking-wider" style={{ color: needleColor }}>
                {getZoneLabel(value) === getZoneSide(value)
                  ? getZoneLabel(value)
                  : `${getZoneLabel(value)} / ${getZoneSide(value)}`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const RiskEngine = () => {
  const defaults = {
    equity: '10000',
    riskPct: '1',
    entry: '67500',
    stopLoss: '66000',
    winRate: '55',
    rrRatio: '2',
  };

  const [rawInputs, setRawInputs] = useState(() => {
    const stored = loadStorage(STORAGE_KEY, null);
    if (stored) {
      const converted = {};
      for (const k of Object.keys(defaults)) {
        converted[k] = stored[k] != null ? String(stored[k]) : defaults[k];
      }
      return converted;
    }
    return defaults;
  });

  const numericInputs = useMemo(() => {
    const out = {};
    for (const k of Object.keys(rawInputs)) {
      const n = parseFloat(rawInputs[k]);
      out[k] = isNaN(n) ? 0 : n;
    }
    return out;
  }, [rawInputs]);

  useEffect(() => { saveStorage(STORAGE_KEY, numericInputs); }, [numericInputs]);

  const results = useMemo(() => {
    const { equity, riskPct, entry, stopLoss, winRate, rrRatio } = numericInputs;
    const pos = calcPositionSize(equity, riskPct, entry, stopLoss);
    const kelly = calcKelly(winRate / 100, rrRatio);
    const ror = calcRiskOfRuin(winRate / 100, rrRatio, riskPct);
    return { ...pos, kelly, ror };
  }, [numericInputs]);

  const update = (field, value) => {
    let cleaned = value;
    if (cleaned !== '' && !/^\./.test(cleaned)) {
      cleaned = cleaned.replace(/^(-?)0+(\d)/, '$1$2');
    }
    setRawInputs((p) => ({ ...p, [field]: cleaned }));
  };

  const rorColor = results.ror < 0.01 ? 'text-accent-emerald'
    : results.ror < 0.05 ? 'text-accent-amber' : 'text-accent-rose';

  const rorPct = results.ror * 100;
  const rorDisplay = rorPct === 0 && numericInputs.winRate > 0 && numericInputs.rrRatio > 0
    ? '< 0.0001%'
    : rorPct < 0.0001 && rorPct > 0
      ? '< 0.0001%'
      : `${rorPct.toFixed(4)}%`;

  const rorLabel = results.ror === 0 && numericInputs.winRate > 0 ? 'MINIMAL'
    : results.ror < 0.000001 ? 'MINIMAL'
    : results.ror < 0.01 ? 'ACCEPTABLE'
    : results.ror < 0.05 ? 'ELEVATED' : 'CRITICAL';

  return (
    <div className="flex flex-col space-y-6 overflow-visible w-full">
      {/* ═══ 1. Risk-Quant Engine ═══ */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <Calculator size={13} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
              RISK-QUANT ENGINE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target size={10} className="text-text-secondary" />
            <span className="font-mono text-[10px] lg:text-[0.55rem] text-text-secondary pr-2 lg:pr-4">POSITION SIZER</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 lg:px-3 py-2 space-y-2 lg:space-y-2.5 min-h-0">
          {/* Position Inputs */}
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
            <Field icon={<DollarSign size={10} />} label="EQUITY" value={rawInputs.equity} onChange={(v) => update('equity', v)} suffix="USD" />
            <Field icon={<Percent size={10} />} label="RISK %" value={rawInputs.riskPct} onChange={(v) => update('riskPct', v)} suffix="%" />
            <Field icon={<Crosshair size={10} />} label="ENTRY PRICE" value={rawInputs.entry} onChange={(v) => update('entry', v)} suffix="USD" />
            <Field icon={<OctagonX size={10} />} label="STOP LOSS" value={rawInputs.stopLoss} onChange={(v) => update('stopLoss', v)} suffix="USD" />
          </div>

          {/* Position Results */}
          <div className="glass rounded-lg p-2 lg:p-2.5 neon-blue">
            <div className="grid grid-cols-3 gap-1">
              <Stat label="POS SIZE" value={`$${results.positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-accent-blue" />
              <Stat label="$ AT RISK" value={`$${results.dollarRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-accent-amber" />
              <Stat label="UNITS" value={results.units.toFixed(4)} color="text-text-primary" />
            </div>
          </div>

          {/* Kelly / RoR Inputs */}
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
            <Field icon={<TrendingUp size={10} />} label="WIN RATE" value={rawInputs.winRate} onChange={(v) => update('winRate', v)} suffix="%" />
            <Field icon={<Target size={10} />} label="RR RATIO" value={rawInputs.rrRatio} onChange={(v) => update('rrRatio', v)} suffix="R" />
          </div>

          {/* Kelly / RoR Results */}
          <div className="glass rounded-lg p-2 lg:p-2.5 neon-purple">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <Brain size={10} className="text-accent-purple" />
                  <span className="font-mono text-[10px] lg:text-[0.55rem] font-semibold text-white tracking-wider">KELLY CRITERION</span>
                  <InfoTooltip text="Suggests the optimal percentage of capital to risk per trade to maximize long-term growth. Formula: (WinRate x RR - LossRate) / RR" />
                </div>
                <span className="font-mono text-sm lg:text-lg font-bold text-accent-purple">
                  {(results.kelly * 100).toFixed(2)}%
                </span>
                <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-secondary">
                  Half Kelly: {(results.kelly * 50).toFixed(2)}%
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <AlertTriangle size={10} className="text-accent-amber" />
                  <span className="font-mono text-[10px] lg:text-[0.55rem] font-semibold text-white tracking-wider">RISK OF RUIN</span>
                  <InfoTooltip text="The statistical probability of losing your entire trading account based on current strategy performance and risk units" />
                </div>
                <span className={`font-mono text-sm lg:text-lg font-bold ${rorColor}`}>
                  {rorDisplay}
                </span>
                <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-secondary">{rorLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 2. Technical Gauge (BITCOIN ONLY) ═══ */}
      <div className="h-[300px] lg:h-[400px] bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <Gauge size={13} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">
              BITCOIN
            </span>
          </div>
          <span className="font-mono text-[10px] lg:text-[0.55rem] text-text-secondary pr-1 lg:pr-2">
            TECHNICAL GAUGE
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden relative">
          {/* Position widget so its internal title (top ~52px) is clipped above the visible area */}
          <div className="absolute inset-0" style={{ top: '-52px', bottom: '0', height: 'calc(100% + 52px)' }}>
            <TechGaugeWidget />
          </div>
        </div>
      </div>

      {/* ═══ 3. Bitcoin Sentiment (Richter Scale) ═══ */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col overflow-hidden">
        <BitcoinSentiment />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

/* InfoTooltip: hover-activated tooltip with Framer Motion */
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  return (
    <div
      className="relative inline-flex"
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info
        size={10}
        className="text-text-muted cursor-help hover:text-text-secondary transition-colors duration-150"
      />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
            style={{ width: '220px' }}
          >
            <div
              className="rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed text-white"
              style={{
                background: 'rgba(17, 17, 17, 0.95)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {text}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid rgba(17, 17, 17, 0.95)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Field: touch-friendly input with decimal inputMode */
const Field = ({ icon, label, value, onChange, suffix }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1">
      <span className="text-text-secondary">{icon}</span>
      <label className="font-mono text-[10px] lg:text-[0.6rem] font-bold text-white tracking-wider">{label}</label>
    </div>
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) {
            onChange(raw);
          }
        }}
        className="input-terminal pr-8 text-sm lg:text-base"
        style={{ minHeight: '36px' }}
      />
      {suffix && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] lg:text-[0.55rem] text-text-secondary pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="font-mono text-[10px] lg:text-[0.5rem] text-text-secondary tracking-wider">{label}</span>
    <span className={`font-mono text-sm font-bold ${color}`}>{value}</span>
  </div>
);

export default RiskEngine;
