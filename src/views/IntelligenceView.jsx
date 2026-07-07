import React from 'react';
import NewsFeed from '../components/widgets/NewsFeed';
import SentimentSummary from '../components/widgets/SentimentSummary';
import EconomicCalendar from '../components/widgets/EconomicCalendar';
import TrendingNarratives from '../components/widgets/TrendingNarratives';
import TopMoversMini from '../components/widgets/TopMoversMini';
import { motion } from 'framer-motion';

const IntelligenceView = () => {
  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-6 min-h-[600px] pb-4">
      
      {/* Col 1: Sentiment & Movers */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full xl:w-[28%] flex flex-col gap-6"
      >
        <div className="shrink-0 h-[380px]">
          <SentimentSummary />
        </div>
        <div className="flex-1 min-h-[250px]">
          <TopMoversMini />
        </div>
      </motion.div>

      {/* Col 2: Narratives & Calendar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full xl:w-[32%] flex flex-col gap-6"
      >
        <div className="shrink-0 h-[220px]">
          <TrendingNarratives />
        </div>
        <div className="flex-1 min-h-[410px]">
          <EconomicCalendar />
        </div>
      </motion.div>

      {/* Col 3: Live Feed */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full xl:w-[40%] h-[600px] xl:h-auto"
      >
        <NewsFeed />
      </motion.div>

    </div>
  );
};

export default IntelligenceView;
