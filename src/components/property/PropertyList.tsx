import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaBed, FaBath, FaUsers, FaHome, FaWifi } from 'react-icons/fa';
import { Property, PropertyStatus } from '../../types/property';
import { formatPrice, getStatusColor } from '../../utils/formatters';
import { formatImageUrl, getPlaceholderForType } from '../../utils/imageUtils';
import MapView from './MapView';

interface PropertyListProps {
  properties: Property[];
  view?: 'grid' | 'map';
}

const PropertyCard: React.FC<{ property: Property; index: number }> = ({ property, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Extract property amenities for display
  const getAmenityHighlights = (): string[] => {
    if (!property.amenities) return [];
    
    // If amenities is a string, split it
    const amenitiesList = typeof property.amenities === 'string' 
      ? property.amenities.split(',').map(item => item.trim())
      : property.amenities;
      
    return amenitiesList.slice(0, 3);
  };

  // Format property type with proper capitalization
  const formatPropertyType = (type: string | undefined): string => {
    if (!type) return "Property";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const amenityHighlights = getAmenityHighlights();
  const statusClass = property.status ? getStatusColor(property.status as PropertyStatus) : { bg: 'bg-green-100', text: 'text-green-800' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Link to={`/property/${property.id}`} className="block group h-full">
        <motion.div 
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
          whileHover={{ y: -6 }}
        >
          {/* Image Section with loading state */}
          <div className="relative h-52 md:h-60 bg-custom-cream/30">
            {/* Background image skeleton */}
            <div className={`absolute inset-0 bg-gradient-to-br from-custom-cream/50 to-custom-cream/30 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
              <div className="flex items-center justify-center h-full">
                <FaHome className="text-4xl text-custom-terra/20" />
              </div>
            </div>
            
            {/* Actual image */}
            <img 
              src={imageError ? getPlaceholderForType('property') : formatImageUrl(property.image_url)}
              alt={property.name || property.title || 'Property Image'}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                setImageError(true);
                setIsImageLoaded(true);
                // Prevent infinite loading attempts
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = getPlaceholderForType('property');
                  target.onerror = null;
                }
              }}
            />
            
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-custom-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Property Status */}
            {property.status && (
              <div className={`absolute top-3 left-3 px-3 py-1 ${statusClass.bg} ${statusClass.text} text-xs font-medium rounded-full z-10`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </div>
            )}
            
            {/* Property Type Tag */}
            {property.property_type && (
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-custom-sage/90 text-white text-xs rounded-full z-10">
                {formatPropertyType(property.property_type)}
              </div>
            )}
            
            {/* Price Tag */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-custom-terra/90 text-white text-sm font-medium rounded-full z-10">
                {formatPrice(typeof property.price === 'string' ? parseFloat(property.price) : (property.price as number || 0))}
              <span className="text-xs opacity-80">/night</span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-5 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-custom-dark group-hover:text-custom-terra transition-colors duration-300 line-clamp-1">
                {property.name || property.title || "Luxury Villa"}
              </h3>
              
              {property.rating && (
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-custom-charcoal">{property.rating}</span>
                </div>
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-center text-custom-charcoal mb-3 text-sm">
              <FaMapMarkerAlt className="text-custom-terra mr-2 flex-shrink-0" />
              <span className="truncate">
                {property.location}
                {property.country && `, ${property.country}`}
              </span>
            </div>
            
            {/* Description */}
            {property.description && (
              <p className="text-custom-charcoal text-sm mb-4 line-clamp-2 flex-grow">
                {property.description}
              </p>
            )}
            
            {/* Features */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-custom-cream">
              <div className="flex items-center gap-4">
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
              
              {/* Amenities snippets */}
              {amenityHighlights.length > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  <FaWifi className="text-custom-sage" />
                  <span className="text-xs text-custom-charcoal whitespace-nowrap">
                    +{amenityHighlights.length} amenities
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const PropertyList: React.FC<PropertyListProps> = ({ properties, view = 'grid' }) => {
  if (view === 'map' && properties.length > 0) {
    return <MapView properties={properties} />;
  }
  
  // Handle empty state
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-md">
        <FaHome className="mx-auto text-5xl text-custom-terra/30 mb-4" />
        <h3 className="text-xl font-semibold text-custom-dark mb-2">No properties found</h3>
        <p className="text-custom-charcoal">Try adjusting your filters or search criteria</p>
      </div>
    );
  }
  
  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            index={index} 
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default PropertyList;
