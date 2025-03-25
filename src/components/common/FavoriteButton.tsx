import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../api/api';

interface FavoriteButtonProps {
  propertyId: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  size = 'medium',
  className = '',
}) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: 'text-lg p-1',
    medium: 'text-xl p-2',
    large: 'text-2xl p-3',
  };

  // Simple notification that the feature is unavailable
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a message in the UI
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-md text-white bg-blue-500';
    notification.textContent = 'Favorites feature is currently unavailable';
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]} ${className}`}
      aria-label="Favorites feature unavailable"
      data-property-id={propertyId}
    >
      <FaHeart className="text-custom-terra/50 transition-colors" />
    </motion.button>
  );
};

export default FavoriteButton;
