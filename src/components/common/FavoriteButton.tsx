import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { favoritesService } from '../../api/auth';
import { userService } from '../../api/api';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  propertyId: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  size = 'medium',
  className = '',
  showText = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    small: 'text-lg p-1',
    medium: 'text-xl p-2',
    large: 'text-2xl p-3',
  };

  // Check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const isInFavorites = await favoritesService.isPropertyInFavorites(propertyId);
        setIsFavorite(isInFavorites);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [propertyId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(propertyId);
        toast.success('Removed from favorites');
        setIsFavorite(false);
      } else {
        await favoritesService.addToFavorites(propertyId);
        toast.success('Added to favorites');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        disabled={isLoading}
        className={`rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]} ${className}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FaHeart 
          className={`
            ${isLoading ? 'animate-pulse' : ''} 
            transition-colors
            ${isFavorite ? 'text-custom-terra' : 'text-custom-terra/50'}
          `} 
        />
      </motion.button>
      {showText && (
        <span className="text-white">{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      )}
    </div>
  );
};

export default FavoriteButton;
