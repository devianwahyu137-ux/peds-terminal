import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './layout/Sidebar';
import TopNav from './layout/TopNav';
import DashboardView from '../views/DashboardView';
import IntelligenceView from '../views/IntelligenceView';
import RiskView from '../views/RiskView';
import ScreenerView from '../views/ScreenerView';

const DashboardShell = ({ symbols, activeSymbol, setActiveSymbol }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView activeSymbol={activeSymbol} />;
      case 'intelligence':
        return <IntelligenceView />;
      case 'risk':
        return <RiskView />;
      case 'screener':
        return <ScreenerView />;
      default:
        return <DashboardView activeSymbol={activeSymbol} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-terminal-bg text-text-primary overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopNav 
          symbols={symbols} 
          activeSymbol={activeSymbol} 
          setActiveSymbol={setActiveSymbol} 
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 lg:px-8 pb-10 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="min-h-full py-4"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
