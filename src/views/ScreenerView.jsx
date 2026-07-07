import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import FilterBar from '../components/widgets/FilterBar';
import AdvancedDataGrid from '../components/widgets/AdvancedDataGrid';
import { motion } from 'framer-motion';

const ScreenerView = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <Card className="h-full flex flex-col">
          <FilterBar 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <div className="flex-1 overflow-hidden">
            <AdvancedDataGrid categoryFilter={activeCategory} searchQuery={searchQuery} />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScreenerView;
