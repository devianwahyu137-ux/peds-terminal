import React, { useEffect, useRef } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { CalendarDays } from 'lucide-react';

const EconomicCalendar = () => {
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
      colorTheme: 'dark', 
      isTransparent: true, 
      width: '100%', 
      height: '100%',
      locale: 'en', 
      importanceFilter: '-1,0,1', 
      countryFilter: 'us,eu,gb,jp,cn',
    });
    container.appendChild(script);
    
    return () => { if (container) container.innerHTML = ''; };
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Macro Calendar" icon={CalendarDays} />
      <div className="flex-1 w-full relative min-h-[300px]" ref={containerRef}>
        {/* TradingView script injects iframe here */}
      </div>
    </Card>
  );
};

export default EconomicCalendar;
