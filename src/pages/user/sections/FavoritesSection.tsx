import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { NavigateFunction } from 'react-router-dom';

interface FavoritesSectionProps {
  navigate: NavigateFunction;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ navigate }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-12 text-center shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-custom-cream/20 rounded-full p-8 inline-flex mb-6">
        <FaHeart className="text-5xl text-custom-terra/50" />
      </div>
      <h3 className="text-2xl font-medium text-custom-dark mb-3">
        No favorites yet
      </h3>
      <p className="text-custom-charcoal mb-6 max-w-md mx-auto">
        You haven't saved any properties to your favorites yet. 
        Browse our collection and save the ones you love!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/properties')}
        className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
      >
        Explore Properties
      </motion.button>
    </motion.div>
  );
};

export default FavoritesSection;
