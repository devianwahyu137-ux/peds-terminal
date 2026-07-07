import React from 'react';
import PositionSizer from '../components/widgets/PositionSizer';
import FearGreedIndex from '../components/widgets/FearGreedIndex';
import ValueAtRiskGauge from '../components/widgets/ValueAtRiskGauge';
import TechGauge from '../components/widgets/TechGauge';
import { motion } from 'framer-motion';

const RiskView = () => {
  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-6 min-h-[700px]">
      
      {/* Left Column: Interactive Position Sizer */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full xl:w-7/12 h-auto"
      >
        <PositionSizer />
      </motion.div>

      {/* Right Column: Gauges and Sentiment */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full xl:w-5/12 flex flex-col gap-6"
      >
        {/* Top Half of Right Column */}
        <div className="flex flex-col sm:flex-row gap-6 h-[250px]">
          <div className="w-full sm:w-1/2">
            <ValueAtRiskGauge />
          </div>
          <div className="w-full sm:w-1/2">
            <FearGreedIndex />
          </div>
        </div>

        {/* Bottom Half of Right Column */}
        <div className="flex-1 min-h-[350px]">
          <TechGauge />
        </div>
      </motion.div>

    </div>
  );
};

export default RiskView;
