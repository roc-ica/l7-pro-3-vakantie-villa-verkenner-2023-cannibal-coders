import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { NavigateFunction } from 'react-router-dom';
import { favoritesService } from '../../../api/auth';
import PropertyCard from '../../../components/property/PropertyCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { propertyService, userService } from '../../../api/api'; // Added userService import
import { toast } from 'react-hot-toast';

interface FavoritesSectionProps {
  navigate: NavigateFunction;
}

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  images: any[];
  description: string;
  // Add any other property fields you need
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ navigate }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        // Get favorites without requiring user ID
        const response = await favoritesService.getFavorites();
        const favoriteIds = response.favorites.map((fav: any) => fav.id);
        
        if (favoriteIds.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch property details for each favorite
        const favoriteProperties = await Promise.all(
          favoriteIds.map(async (id: number) => {
            try {
              const property = await propertyService.getPropertyById(id);
              return property;
            } catch (error) {
              console.error(`Error fetching property ${id}:`, error);
              return null;
            }
          })
        );

        setFavorites(favoriteProperties.filter(Boolean) as Property[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Handle removing a property from favorites
  const handleRemoveFromFavorites = async (propertyId: number) => {
    try {
      await favoritesService.removeFromFavorites(propertyId);
      setFavorites(favorites.filter(property => property.id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-custom-dark mb-6">My Favorite Properties</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
          <div className="bg-custom-cream/20 rounded-full p-8 inline-flex mb-6">
            <FaHeart className="text-5xl text-custom-terra/50" />
          </div>
          <h3 className="text-2xl font-medium text-custom-dark mb-3">
            No Favorites Yet
          </h3>
          <p className="text-custom-charcoal mb-6 max-w-md mx-auto">
            You haven't added any properties to your favorites yet.
            Explore our properties and add some to your favorites!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors flex items-center justify-center gap-2"
          >
            <FaSearch />
            Explore Properties
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onFavoriteToggle={() => handleRemoveFromFavorites(property.id)} 
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesSection;
