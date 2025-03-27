// filepath: c:\Users\ivanr\OneDrive\Documenten\school\l7-pro-3-vakantie-villa-verkenner-2023-cannibal-coders\src\components\property\search\SearchActions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

interface SearchActionsProps {
  onSearch: () => void;
  onReset: () => void;
  className?: string;
}

const SearchActions: React.FC<SearchActionsProps> = ({ onSearch, onReset, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <motion.button
        type="submit"
        onClick={onSearch}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-custom-terra text-white font-medium rounded-lg hover:bg-custom-terra/90 transition-colors flex items-center justify-center"
      >
        <FaSearch className="mr-2" />
        Search Properties
      </motion.button>
      
      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 border border-custom-charcoal/30 text-custom-charcoal rounded-lg hover:bg-custom-cream transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SearchActions;