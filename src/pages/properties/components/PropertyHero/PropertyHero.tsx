import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaDollarSign, FaTag, FaHome, FaHeart } from 'react-icons/fa';
import { formatImageUrl, getPlaceholderForType } from '../../../../utils/imageUtils';
import { Property } from '../../../../types/property';
import FavoriteButton from '../../../../components/common/FavoriteButton';

// Update interface to remove favorite-related props
export interface PropertyHeroProps {
  property: Property;
  formattedPrice: string;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
  locationOption?: { id: number; name: string; description?: string } | null;
  propertyTypeInfo?: { id: string; name: string; description: string } | null;
}

const PropertyHero: React.FC<PropertyHeroProps> = ({ 
  property, 
  formattedPrice, 
  isGeneratingPDF, 
  onDownloadPDF,
  locationOption,
  propertyTypeInfo
}) => {
  return (
    <div className="relative h-[500px] md:h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={formatImageUrl(property.image_url)} 
          alt={property.name}
          className="w-full h-full object-cover"
           onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
           const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder')) {
              target.src = getPlaceholderForType('property');
              target.onerror = null;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-custom-dark/90 via-custom-dark/40 to-transparent" />
      </div>

      {/* Header Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-12">
          {/* Top navigation - remove favorite button */}
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/properties"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white transition-colors hover:bg-white/20"
            >
              <FaArrowLeft /> Back to Properties
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {property.name || property.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-custom-terra" />
                <span>{property.location}{property.country ? `, ${property.country}` : ''}</span>
              </div>
              
              <div className="flex items-center">
                <FaDollarSign className="mr-2 text-custom-terra" />
                <span className="text-xl font-semibold">{formattedPrice}</span>
              </div>

              {/* Property Type Badge */}
              {propertyTypeInfo && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center">
                  <FaHome className="mr-1" />
                  {propertyTypeInfo.name}
                </span>
              )}
              
              {/* Location Type Badge */}
              {locationOption && (
                <span className="px-3 py-1 bg-custom-terra/90 backdrop-blur-sm rounded-full text-sm flex items-center">
                  <FaTag className="mr-1" />
                  {locationOption.name}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{property.name}</h1>
            <p className="text-xl text-custom-cream mb-6">{property.location}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Book Now button (existing) */}
              <button className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors flex items-center gap-2">
                Book Now <span className="ml-1">→</span>
              </button>
              
              {/* Add Favorite button below Book Now */}
              <FavoriteButton 
                propertyId={property.id} 
                size="large" 
                className="bg-white hover:bg-custom-cream"
                showText={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHero;
