import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', elevated = false, ...props }) => {
  const baseClass = elevated ? 'glass-elevated glass-edge' : 'glass glass-edge';
  return (
    <motion.div 
      className={`${baseClass} p-4 md:p-5 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ title, icon: Icon, rightElement, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-text-secondary" />}
      <h3 className="section-header">{title}</h3>
    </div>
    {rightElement && <div>{rightElement}</div>}
  </div>
);
