import { useEffect, useRef } from 'react';

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
    <div className="tradingview-widget-container w-full h-full" ref={containerRef} title="Economic Calendar">
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default EconomicCalendarWidget;
