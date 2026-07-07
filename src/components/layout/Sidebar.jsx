import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BrainCircuit, ShieldAlert, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
  { id: 'risk', label: 'Risk Engine', icon: ShieldAlert },
  { id: 'screener', label: 'Screener', icon: BarChart3 },
];

const Sidebar = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-16 lg:w-64 h-full glass-elevated rounded-none lg:rounded-r-2xl border-l-0 flex flex-col justify-between py-6 transition-all duration-300 relative z-40">
      
      {/* Brand */}
      <div className="px-4 lg:px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.4)] shrink-0">
          <span className="font-mono font-bold text-white text-xs">PD</span>
        </div>
        <div className="hidden lg:block overflow-hidden">
          <h1 className="font-mono text-sm font-bold tracking-wider text-text-primary whitespace-nowrap">
            PEDS TERMINAL
          </h1>
          <p className="font-mono text-[0.6rem] text-text-secondary tracking-[0.2em]">
            SYSTEM V2
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <Icon 
                size={18} 
                className={`transition-colors duration-200 ${isActive ? 'text-accent-blue' : 'group-hover:text-accent-blue/70'}`} 
              />
              <span className="font-sans text-sm font-medium hidden lg:block">
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-blue rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="px-3 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all duration-200">
          <Settings size={18} />
          <span className="font-sans text-sm font-medium hidden lg:block">
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
