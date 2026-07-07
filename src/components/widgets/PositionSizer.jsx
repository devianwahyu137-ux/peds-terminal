import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Calculator, Target, Brain, AlertTriangle, Info, DollarSign, Percent, Crosshair, OctagonX, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* Math */
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
  return Math.max(0, (rrRatio * p - q) / rrRatio);
};

const calcRiskOfRuin = (winRate, rrRatio, riskPct) => {
  if (riskPct <= 0 || winRate <= 0 || winRate >= 1) return 0;
  const p = winRate;
  const edge = p * rrRatio - (1 - p);
  if (edge <= 0) return 1;
  const ror = Math.pow((1 - edge) / (1 + edge), 100 / riskPct);
  return Math.min(1, Math.max(0, ror));
};

/* Components */
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={12} className="text-zinc-500 cursor-help hover:text-white transition-colors" />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl z-50 text-[0.65rem] text-zinc-300 font-sans pointer-events-none"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({ icon: Icon, label, value, onChange, suffix }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Icon size={12} />
        <span className="font-mono text-[0.65rem] font-bold tracking-wider">{label}</span>
      </div>
      <div className="relative">
        <input
          type="text" inputMode="decimal" value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) onChange(raw);
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500">{suffix}</span>}
      </div>
    </div>
  );
};

const PositionSizer = () => {
  const [inputs, setInputs] = useState({
    equity: '10000', riskPct: '1', entry: '67500', stopLoss: '66000', winRate: '55', rrRatio: '2'
  });

  const numeric = useMemo(() => {
    const out = {};
    for (const k in inputs) {
      const n = parseFloat(inputs[k]);
      out[k] = isNaN(n) ? 0 : n;
    }
    return out;
  }, [inputs]);

  const results = useMemo(() => {
    const { equity, riskPct, entry, stopLoss, winRate, rrRatio } = numeric;
    const pos = calcPositionSize(equity, riskPct, entry, stopLoss);
    const kelly = calcKelly(winRate / 100, rrRatio);
    const ror = calcRiskOfRuin(winRate / 100, rrRatio, riskPct);
    return { ...pos, kelly, ror };
  }, [numeric]);

  const update = (field, val) => {
    let cleaned = val;
    if (cleaned !== '' && !/^\./.test(cleaned)) cleaned = cleaned.replace(/^(-?)0+(\d)/, '$1$2');
    setInputs(p => ({ ...p, [field]: cleaned }));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Position Sizer & Risk Math" icon={Calculator} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        
        {/* Trade Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <Field icon={DollarSign} label="EQUITY" value={inputs.equity} onChange={(v) => update('equity', v)} suffix="USD" />
          <Field icon={Percent} label="RISK" value={inputs.riskPct} onChange={(v) => update('riskPct', v)} suffix="%" />
          <Field icon={Crosshair} label="ENTRY" value={inputs.entry} onChange={(v) => update('entry', v)} suffix="USD" />
          <Field icon={OctagonX} label="STOP LOSS" value={inputs.stopLoss} onChange={(v) => update('stopLoss', v)} suffix="USD" />
        </div>

        {/* Position Result Box */}
        <div className="p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-mono text-[0.6rem] text-accent-blue uppercase mb-1">Pos Size</p>
              <p className="font-mono text-base font-bold text-white">${results.positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p className="font-mono text-[0.6rem] text-accent-amber uppercase mb-1">$ At Risk</p>
              <p className="font-mono text-base font-bold text-white">${results.dollarRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p className="font-mono text-[0.6rem] text-zinc-400 uppercase mb-1">Units</p>
              <p className="font-mono text-base font-bold text-white">{results.units.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Strategy Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <Field icon={TrendingUp} label="WIN RATE" value={inputs.winRate} onChange={(v) => update('winRate', v)} suffix="%" />
          <Field icon={Target} label="R:R RATIO" value={inputs.rrRatio} onChange={(v) => update('rrRatio', v)} suffix="R" />
        </div>

        {/* Kelly / RoR Result Box */}
        <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Brain size={12} className="text-accent-purple" />
              <span className="font-mono text-[0.65rem] font-bold text-accent-purple">KELLY</span>
              <InfoTooltip text="Optimal % of capital to risk per trade to maximize long-term growth." />
            </div>
            <p className="font-mono text-lg font-bold text-white">{(results.kelly * 100).toFixed(2)}%</p>
            <p className="font-mono text-[0.6rem] text-zinc-500">Half: {(results.kelly * 50).toFixed(2)}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} className="text-rose-400" />
              <span className="font-mono text-[0.65rem] font-bold text-rose-400">RUIN RISK</span>
              <InfoTooltip text="Probability of losing the entire account based on this strategy." />
            </div>
            <p className="font-mono text-lg font-bold text-white">
              {results.ror < 0.0001 && results.ror > 0 ? '< 0.01%' : `${(results.ror * 100).toFixed(2)}%`}
            </p>
            <p className="font-mono text-[0.6rem] text-zinc-500">
              {results.ror < 0.01 ? 'Acceptable' : 'Elevated'}
            </p>
          </div>
        </div>

        {/* NEW: Risk:Reward Visualizer */}
        <div className="pt-2 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[0.65rem] text-text-secondary uppercase">Risk vs Reward (USD)</span>
            <span className="font-mono text-xs font-bold text-white">1 : {numeric.rrRatio}</span>
          </div>
          <div className="w-full h-6 rounded-md overflow-hidden flex bg-white/5 border border-white/5 relative">
            <div 
              className="h-full bg-rose-500/80 flex items-center justify-start px-2 relative group" 
              style={{ width: `${100 / (1 + numeric.rrRatio)}%` }}
            >
              <span className="font-mono text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                -${results.dollarRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div 
              className="h-full bg-emerald-500/80 flex items-center justify-end px-2 relative group"
              style={{ width: `${(numeric.rrRatio * 100) / (1 + numeric.rrRatio)}%` }}
            >
              <span className="font-mono text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                +${(results.dollarRisk * numeric.rrRatio).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-1 text-[9px] font-mono text-zinc-500">
            <span>Stop Loss</span>
            <span>Take Profit</span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PositionSizer;
