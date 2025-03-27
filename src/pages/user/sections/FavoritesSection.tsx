import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { NavigateFunction } from 'react-router-dom';
import { userService } from '../../../api/api';

interface FavoritesSectionProps {
  navigate: NavigateFunction;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ navigate }) => {
  // We no longer need the favorites state or loading logic
  const isLoggedIn = userService.isLoggedIn();

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
        Favorites Feature Unavailable
      </h3>
      <p className="text-custom-charcoal mb-6 max-w-md mx-auto">
        Our favorites feature is currently under maintenance.
        Please check back later to save and view your favorite properties.
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
