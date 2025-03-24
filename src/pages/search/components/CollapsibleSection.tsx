import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  icon: React.ElementType;
  defaultExpanded?: boolean;
  children: ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<Props> = ({ 
  title, 
  icon: Icon, 
  defaultExpanded = true, 
  children,
  className = '' 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20 ${className}`}>
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Icon className="text-custom-terra" />
          <h3 className="font-medium text-custom-dark">{title}</h3>
        </div>
        <motion.div 
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-custom-charcoal/70"
        >
          ▼
        </motion.div>
      </div>
      
      {expanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default CollapsibleSection;
