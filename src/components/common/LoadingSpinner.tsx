import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = 'custom-terra'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
  };

  return (
    <motion.div 
      className={`border-solid rounded-full ${sizeClasses[size]} border-gray-200`}
      style={{ 
        borderTopColor: `var(--color-${color}, #e07a5f)`,
        borderRightColor: `var(--color-${color}, #e07a5f)`,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
      }}
      animate={{ rotate: 360 }}
      transition={{ 
        repeat: Infinity, 
        duration: 1, 
        ease: "linear" 
      }}
    />
  );
};

export default LoadingSpinner;
