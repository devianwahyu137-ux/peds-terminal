import { useEffect, useRef } from 'react';

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

export default CryptoScreenerWidget;
