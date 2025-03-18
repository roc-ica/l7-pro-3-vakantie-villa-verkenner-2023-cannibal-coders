import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import { Property } from '../../types/property';
import { formatPrice } from '../../utils/formatters';
import { formatImageUrl, getPlaceholderForType } from '../../utils/imageUtils';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  // Extract needed properties with fallbacks
  const {
    id,
    name,
    location,
    country,
    price,
    bedrooms,
    bathrooms,
    image_url
  } = property;

  // Get location option directly from property
  const locationOption = property.location_option;

  // Format price
  const priceValue = typeof price === 'number' 
    ? price 
    : typeof price === 'string' 
      ? parseFloat(String(price).replace(/[^0-9.]/g, '') || '0') 
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/property/${id}`} className="group">
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
          <div className="relative overflow-hidden">
            <img
              src={formatImageUrl(image_url)}
              alt={name}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = getPlaceholderForType('property');
                  target.onerror = null;
                }
              }}
            />
            <div className="absolute top-0 right-0 bg-custom-terra text-white px-3 py-1 m-3 rounded-lg font-medium">
              {formatPrice(priceValue)}
            </div>
            {/* Location type badge */}
            {locationOption && (
              <div className="absolute top-4 left-4 bg-white/90 text-custom-terra px-3 py-1 rounded-full font-medium shadow-md text-sm flex items-center">
                <FaTag className="mr-1" size={12} />
                {locationOption.name}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-custom-dark group-hover:text-custom-terra transition-colors mb-1">
              {name}
            </h3>
            
            <div className="flex items-center text-custom-charcoal mb-3">
              <FaMapMarkerAlt className="text-custom-terra mr-1" />
              <span className="text-sm">{location}, {country}</span>
            </div>
            
            <div className="flex justify-between items-center text-custom-charcoal pt-2 border-t border-gray-100">
              {bedrooms !== undefined && (
                <div className="flex items-center">
                  <FaBed className="mr-1 text-custom-sage" />
                  <span>{bedrooms} Beds</span>
                </div>
              )}
              
              {bathrooms !== undefined && (
                <div className="flex items-center">
                  <FaBath className="mr-1 text-custom-sage" />
                  <span>{bathrooms} Baths</span>
                </div>
              )}
              
              <span className="text-custom-terra font-medium underline opacity-0 group-hover:opacity-100 transition-opacity">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
