import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { NavigateFunction } from 'react-router-dom';
import { favoritesService } from '../../../api/api';
import { Property } from '../../../types/property';
import PropertyList from '../../../components/property/PropertyList';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface FavoritesSectionProps {
  navigate: NavigateFunction;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ navigate }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching favorites for user profile');
        const data = await favoritesService.getFavorites();
        console.log('Favorites fetched:', data);
        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load your favorites. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = (propertyId: number) => {
    console.log(`Removing property ${propertyId} from favorites list`);
    setFavorites(favorites.filter(property => property.id !== propertyId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-white rounded-xl p-12 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-custom-terra mb-4">
          <span className="text-xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-medium text-custom-dark mb-3">
          Something went wrong
        </h3>
        <p className="text-custom-charcoal mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  console.log('Rendering favorites section with', favorites.length, 'items');

  if (favorites.length === 0) {
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
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-medium text-custom-dark mb-6">
      Your Favorite Properties
      </h3>
      <PropertyList 
      properties={favorites}
      />
    </motion.div>
  );
};

export default FavoritesSection;
