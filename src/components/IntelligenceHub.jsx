import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, AlertTriangle, TrendingUp, Hash, Calendar,
  ExternalLink, Flame, WifiOff, RefreshCw,
} from 'lucide-react';

const RSS_PARSER = 'https://api.rss2json.com/v1/api.json?rss_url=';
const MACRO_FEEDS = [
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC' },
  { url: 'https://www.reutersagency.com/feed/?best-topics=business&post_type=best', source: 'Reuters' },
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' },
];
const CRYPTO_FEEDS = [
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block' },
];
const REFRESH_INTERVAL = 900_000;
const MAX_ITEMS = 10;

const relativeTime = (dateStr) => {
  try {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    if (isNaN(then)) return '';
    const s = Math.floor((now - then) / 1000);
    if (s < 0) return 'just now';
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return ''; }
};

const classifyTag = (title) => {
  const t = title.toLowerCase();
  if (/\b(ai|artificial intelligence|gpt|machine learning|neural|agent|bittensor|render)\b/.test(t)) return { tag: 'AI', badge: 'badge-ai' };
  if (/\b(l2|layer.?2|arbitrum|optimism|base|zk.?sync|polygon|rollup|starknet)\b/.test(t)) return { tag: 'L2', badge: 'badge-l2' };
  if (/\b(rwa|tokeniz|real.?world|treasury|t.?bill|blackrock|ondo)\b/.test(t)) return { tag: 'RWA', badge: 'badge-rwa' };
  if (/\b(defi|dex|uniswap|aave|lend|swap|yield|liquidity|amm|staking)\b/.test(t)) return { tag: 'DeFi', badge: 'badge-defi' };
  if (/\b(bitcoin|btc|halving|mining|satoshi)\b/.test(t)) return { tag: 'BTC', badge: 'badge-high' };
  if (/\b(ethereum|eth|eip|vitalik|beacon)\b/.test(t)) return { tag: 'ETH', badge: 'badge-l2' };
  if (/\b(nft|metaverse|gaming|play.?to.?earn)\b/.test(t)) return { tag: 'NFT', badge: 'badge-defi' };
  if (/\b(regulation|sec|law|compliance|ban|legal|congress)\b/.test(t)) return { tag: 'REG', badge: 'badge-high' };
  if (/\b(solana|sol)\b/.test(t)) return { tag: 'SOL', badge: 'badge-rwa' };
  return { tag: 'CRYPTO', badge: 'badge-ai' };
};

const normalizeTitle = (t) => (t || '').trim().toLowerCase().replace(/\s+/g, ' ');

const fetchSingleFeed = async (feedUrl, sourceName) => {
  try {
    const res = await fetch(`${RSS_PARSER}${encodeURIComponent(feedUrl)}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== 'ok' || !json.items) return [];
    return json.items.map((item) => ({ ...item, _source: sourceName }));
  } catch { return []; }
};

const fetchAggregated = async (feeds, limit = MAX_ITEMS) => {
  const results = await Promise.all(feeds.map((f) => fetchSingleFeed(f.url, f.source)));
  const all = results.flat();
  const seen = new Set();
  const unique = all.filter((item) => {
    const key = normalizeTitle(item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());
  return unique.slice(0, limit);
};

const useAggregatedFeed = (feeds) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const doFetch = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const merged = await fetchAggregated(feeds, MAX_ITEMS);
      if (merged.length === 0) throw new Error('No items');
      setItems(merged); setLastUpdated(new Date());
    } catch {
      setError((prev) => items.length === 0 ? true : prev);
    } finally { setLoading(false); }
  }, [feeds]);
  useEffect(() => {
    doFetch();
    const interval = setInterval(doFetch, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [doFetch]);
  return { items, loading, error, lastUpdated };
};

const SkeletonRow = () => (
  <div className="glass rounded-lg px-3 py-2.5 space-y-2 animate-pulse">
    <div className="h-2.5 rounded bg-white/[0.04] w-[85%]" />
    <div className="h-2 rounded bg-white/[0.03] w-[55%]" />
  </div>
);
const FeedError = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-6 opacity-60">
    <WifiOff size={16} className="text-text-muted" />
    <span className="font-mono text-[10px] text-text-muted tracking-wider">SERVICE TEMPORARILY UNAVAILABLE</span>
  </div>
);
const SourceLabel = ({ name }) => (
  <span className="font-mono text-[10px] tracking-wide" style={{ color: '#60A5FA' }}>via {name}</span>
);

const EconomicCalendarWidget = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark', isTransparent: true, width: '100%', height: '100%',
      locale: 'en', importanceFilter: '0,1', countryFilter: 'us,eu,gb,jp,cn',
    });
    container.appendChild(script);
    return () => { if (container) container.innerHTML = ''; };
  }, []);
  return (
    <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
};

const IntelligenceHub = () => {
  const macro = useAggregatedFeed(MACRO_FEEDS);
  const crypto = useAggregatedFeed(CRYPTO_FEEDS);
  return (
    <div className="flex flex-col space-y-6 overflow-visible w-full">
      {/* MACRO INTELLIGENCE */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-2.5">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <Newspaper size={15} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">MACRO INTELLIGENCE</span>
          </div>
          <div className="flex items-center gap-2">
            {macro.lastUpdated && !macro.loading && (
              <span className="font-mono text-[9px] text-text-muted">{relativeTime(macro.lastUpdated.toISOString())}</span>
            )}
            {!macro.loading && !macro.error && macro.items.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Flame size={11} className="text-accent-rose animate-pulse-glow" />
                <span className="font-mono text-[10px] font-semibold text-accent-rose">LIVE</span>
              </div>
            )}
            {macro.loading && (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={10} className="text-text-muted" />
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-visible lg:overflow-y-auto px-3 py-2 space-y-1.5">
          {macro.loading && macro.items.length === 0 && (
            <div className="space-y-1.5">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          )}
          {!macro.loading && macro.error && macro.items.length === 0 && <FeedError />}
          {macro.items.length > 0 && (
            <AnimatePresence>
              {macro.items.map((item, i) => (
                <motion.a key={item.link || `macro-${i}`} href={item.link} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="group glass rounded-lg px-3 py-2.5 block no-underline hover:bg-white/[0.04] transition-all duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-sans text-[11px] lg:text-[0.7rem] text-text-primary leading-relaxed flex-1 group-hover:text-accent-blue transition-colors">{item.title}</p>
                    <span className="badge badge-high flex items-center gap-1 flex-shrink-0"><AlertTriangle size={8} />HIGH</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <SourceLabel name={item._source} />
                    <span className="text-text-muted text-[10px]">·</span>
                    <span className="font-mono text-[10px] text-text-muted">{relativeTime(item.pubDate)}</span>
                    <ExternalLink size={9} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>



      {/* CRYPTO NARRATIVES */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-2.5">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <TrendingUp size={15} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">CRYPTO NARRATIVES</span>
          </div>
          <div className="flex items-center gap-2">
            {crypto.loading && crypto.items.length === 0 && (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={10} className="text-text-muted" />
              </motion.div>
            )}
            {!crypto.loading && (
              <div className="flex items-center gap-1">
                <Hash size={10} className="text-text-secondary" />
                <span className="font-mono text-[10px] text-text-secondary">
                  {crypto.error && crypto.items.length === 0 ? 'N/A' : `${crypto.items.length} SIGNALS`}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-visible lg:overflow-y-auto px-3 py-2 space-y-1.5">
          {crypto.loading && crypto.items.length === 0 && (
            <div className="space-y-1.5">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
          )}
          {!crypto.loading && crypto.error && crypto.items.length === 0 && <FeedError />}
          {crypto.items.length > 0 && (
            <AnimatePresence>
              {crypto.items.map((item, i) => {
                const { tag, badge } = classifyTag(item.title || '');
                return (
                  <motion.a key={item.link || `crypto-${i}`} href={item.link} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                    className="group glass rounded-lg px-3 py-2.5 block no-underline hover:bg-white/[0.04] transition-all duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span className={`badge ${badge} flex-shrink-0 mt-0.5`}>#{tag}</span>
                        <p className="font-sans text-[11px] lg:text-[0.7rem] text-text-primary leading-relaxed group-hover:text-accent-purple transition-colors">{item.title}</p>
                      </div>
                      <ExternalLink size={10} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 pl-[calc(0.6rem+26px)]">
                      <SourceLabel name={item._source} />
                      <span className="text-text-muted text-[10px]">·</span>
                      <span className="font-mono text-[10px] text-text-muted">{relativeTime(item.pubDate)}</span>
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>



      {/* ECONOMIC CALENDAR */}
      <div className="h-[400px] lg:h-[500px] bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors w-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-2.5">
            <div className="w-1 h-3 bg-emerald-500 rounded-sm"></div>
            <Calendar size={15} className="text-emerald-500" />
            <span className="text-emerald-500 font-mono tracking-widest uppercase text-[10px] lg:text-xs">ECONOMIC CALENDAR</span>
          </div>
          <span className="font-mono text-[10px] lg:text-[0.55rem] text-text-muted">HIGH IMPACT</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <EconomicCalendarWidget />
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
