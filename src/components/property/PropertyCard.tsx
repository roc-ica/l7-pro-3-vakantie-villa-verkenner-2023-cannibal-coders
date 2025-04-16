import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaBed, FaBath, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FavoriteButton from '../common/FavoriteButton';

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  images: any[];
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  capacity?: number;
  userId?: number; // Added to track which user favorited this property
}

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onFavoriteToggle,
  isFavorite = false
}) => {
  // Get the first image or use a placeholder
  const mainImage = property.images?.length > 0 
    ? (property.images[0].url || property.images[0].image_url) 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
    >
      <Link to={`/property/${property.id}`} className="block">
        {/* Property Image */}
        <div className="relative h-48">
          <img 
            src={mainImage} 
            alt={property.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          
          {/* Favorite Button */}
          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.preventDefault()}>
            <FavoriteButton 
              propertyId={property.id}
              size="medium"
            />
          </div>
        </div>
        
        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-custom-dark mb-1 truncate">{property.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaMapMarkerAlt className="text-custom-terra mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
          
          {/* Rating */}
          {property.rating && (
            <div className="flex items-center mb-3">
              <div className="flex text-custom-terra">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.round(property.rating) ? 'text-custom-terra' : 'text-gray-300'} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">{property.rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Property features */}
          {(property.bedrooms || property.bathrooms || property.capacity) && (
            <div className="flex items-center gap-4 mb-3">
              {property.bedrooms !== undefined && (
                <div className="flex items-center text-sm">
                  <FaBed className="mr-1 text-custom-sage" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center text-sm">
                  <FaBath className="mr-1 text-custom-sage" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              
              {property.capacity && (
                <div className="flex items-center text-sm">
                  <FaUsers className="mr-1 text-custom-sage" />
                  <span>{property.capacity}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <div className="text-custom-dark">
              <span className="font-bold text-lg">${property.price}</span>
              <span className="text-sm text-gray-600"></span>
            </div>
            <button className="text-sm px-3 py-1 bg-custom-terra/10 text-custom-terra rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
