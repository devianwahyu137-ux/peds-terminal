import React, { useEffect, useRef } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Gauge } from 'lucide-react';

const TechGauge = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: '1h', width: '100%', isTransparent: true, height: '100%',
      symbol: 'BINANCE:BTCUSDT', showIntervalTabs: true, displayMode: 'single',
      locale: 'en', colorTheme: 'dark',
    });
    container.appendChild(script);
    return () => { if (container) container.innerHTML = ''; };
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="BTC Technical Gauge" icon={Gauge} />
      <div className="flex-1 w-full relative min-h-[300px] mt-2 overflow-hidden">
        <div className="absolute inset-0" ref={containerRef} />
      </div>
    </Card>
  );
};

export default TechGauge;
