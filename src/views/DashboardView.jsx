import React from 'react';
import MarketVisualizer from '../components/MarketVisualizer';
import PortfolioOverview from '../components/widgets/PortfolioOverview';
import QuickPulse from '../components/widgets/QuickPulse';
import { motion } from 'framer-motion';

const DashboardView = ({ activeSymbol }) => {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Top Strip: Quick Market Pulse */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full"
      >
        <QuickPulse />
      </motion.div>

      {/* Main Bento Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Left/Center: Hero Chart (Spans 8 columns on large screens) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-8 h-[500px] lg:h-full flex flex-col"
        >
          <div className="w-full h-full glass-elevated rounded-xl border border-white/5 overflow-hidden">
            <MarketVisualizer activeSymbol={activeSymbol} />
          </div>
        </motion.div>

        {/* Right: Portfolio Overview (Spans 4 columns on large screens) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-4 h-full"
        >
          <PortfolioOverview />
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardView;
