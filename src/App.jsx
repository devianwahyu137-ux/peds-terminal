import { useState } from 'react';
import DashboardShell from './components/DashboardShell';

const SYMBOLS = [
  { id: 'BTCUSDT', label: 'BTC', name: 'Bitcoin' },
  { id: 'ETHUSDT', label: 'ETH', name: 'Ethereum' },
  { id: 'SOLUSDT', label: 'SOL', name: 'Solana' },
  { id: 'BNBUSDT', label: 'BNB', name: 'BNB' },
  { id: 'ARBUSDT', label: 'ARB', name: 'Arbitrum' },
  { id: 'LINKUSDT', label: 'LINK', name: 'Chainlink' },
];

function App() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');

  return (
    <DashboardShell
      symbols={SYMBOLS}
      activeSymbol={activeSymbol}
      setActiveSymbol={setActiveSymbol}
    />
  );
}

export default App;
