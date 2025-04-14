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

  // Log component load with accurate user info
  useEffect(() => {
    const userId = userService.getCurrentUserId();
    console.log("[FavoriteButton] Component loaded", { 
      propertyId, 
      isLoggedIn: userService.isLoggedIn(),
      userId
    });
  }, [propertyId]);
  
  // Check if the property is already in favorites on component mount
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        if (!userService.isLoggedIn()) {
          console.log('[FavoriteButton] Not logged in, skipping favorites check');
          return;
        }
        
        const userId = userService.getCurrentUserId();
        console.log(`[FavoriteButton] Checking favorites for property ${propertyId}, user ${userId}`);
        
        const isInFavorites = await favoritesService.isPropertyInFavorites(propertyId);
        console.log(`[FavoriteButton] Property ${propertyId} favorite status:`, isInFavorites);
        setIsFavorite(isInFavorites);
      } catch (error) {
        console.error('[FavoriteButton] Error checking favorite status:', error);
      }
    };
    
    checkIfFavorite();
  }, [propertyId]);

  // Updated click handler to respect authentication
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userId = userService.getCurrentUserId();
    console.log(`[FavoriteButton] Button clicked for property ${propertyId}, user ${userId}`);
    
    // Check if user is logged in
    if (!userService.isLoggedIn()) {
      toast.error('Please login to save favorites');
      return;
    }
    
    setIsLoading(true);
    
    if (isFavorite) {
      console.log(`[FavoriteButton] Calling removeFromFavorites for property ${propertyId}`);
      
      // First call sync function to ensure this is being executed
      console.log("[FavoriteButton] Before API call - remove");
      
      favoritesService.removeFromFavorites(propertyId)
        .then(data => {
          console.log('[FavoriteButton] Remove result:', data);
          if (data.status === 'success') {
            setIsFavorite(false);
            toast.success('Removed from favorites');
          } else {
            toast.error(data.message || 'Failed to remove from favorites');
          }
        })
        .catch(error => {
          console.error('[FavoriteButton] Remove error:', error);
          toast.error('Error updating favorites');
        })
        .finally(() => {
          setIsLoading(false);
          console.log("[FavoriteButton] Remove operation completed");
        });
    } else {
      console.log(`[FavoriteButton] Calling addToFavorites for property ${propertyId}`);
      
      // First call sync function to ensure this is being executed
      console.log("[FavoriteButton] Before API call - add");
      
      favoritesService.addToFavorites(propertyId)
        .then(data => {
          console.log('[FavoriteButton] Add result:', data);
          if (data.status === 'success') {
            setIsFavorite(true);
            toast.success('Added to favorites');
          } else {
            toast.error(data.message || 'Failed to add to favorites');
          }
        })
        .catch(error => {
          console.error('[FavoriteButton] Add error:', error);
          toast.error('Error updating favorites');
        })
        .finally(() => {
          setIsLoading(false);
          console.log("[FavoriteButton] Add operation completed");
        });
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleFavoriteClick}
        disabled={isLoading}
        className={`rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]} ${className}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        type="button"
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
