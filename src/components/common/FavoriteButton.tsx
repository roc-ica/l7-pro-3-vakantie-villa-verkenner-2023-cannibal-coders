import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { favoritesService } from '../../api/api';

interface FavoriteButtonProps {
  propertyId: number;
  initialIsFavorite?: boolean;
  size?: 'small' | 'medium' | 'large';
  onFavoriteChange?: (isFavorite: boolean) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  initialIsFavorite = false,
  size = 'medium',
  onFavoriteChange,
  className = '',
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string} | null>(null);

  // Log for debugging
  useEffect(() => {
    console.log(`FavoriteButton mounted for property ${propertyId} with initial state: ${initialIsFavorite}`);
  }, [propertyId, initialIsFavorite]);

  // Update internal state if initialIsFavorite prop changes
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const sizeClasses = {
    small: 'text-lg p-1',
    medium: 'text-xl p-2',
    large: 'text-2xl p-3',
  };

  // Show a notification message
  const showNotification = (message: string) => {
    setNotification({ message });
    // Hide notification after 2 seconds
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    
    // Check for valid property ID
    if (!propertyId || isNaN(propertyId)) {
      console.error('Invalid property ID in FavoriteButton:', propertyId);
      showNotification('Error: Invalid property ID');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Toggling favorite status for property ${propertyId}. Current status: ${isFavorite ? 'favorited' : 'not favorited'}`);
      
      if (isFavorite) {
        await favoritesService.removeFromFavorites(propertyId);
        showNotification('Removed from favorites');
      } else {
        await favoritesService.addToFavorites(propertyId);
        showNotification('Added to favorites');
      }
      
      const newValue = !isFavorite;
      console.log(`Successfully updated favorite status to: ${newValue ? 'favorited' : 'not favorited'}`);
      setIsFavorite(newValue);
      if (onFavoriteChange) {
        onFavoriteChange(newValue);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleFavorite}
        className={`rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]} ${className}`}
        disabled={isLoading}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        data-property-id={propertyId} // Add data attribute for debugging
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-custom-terra" />
        ) : isFavorite ? (
          <FaHeart className="text-custom-terra transition-colors" />
        ) : (
          <FaRegHeart className="text-custom-charcoal hover:text-custom-terra transition-colors" />
        )}
      </motion.button>
      
      {/* Simple notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-md text-white bg-green-500">
          {notification.message}
        </div>
      )}
    </>
  );
};

export default FavoriteButton;
