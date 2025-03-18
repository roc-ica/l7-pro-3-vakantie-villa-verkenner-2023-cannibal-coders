import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { Property } from '../../../../types/property';
import PropertyMap from '../map/PropertyMap';
import AmenitiesGrid from '../AmenitiesGrid/AmenitiesGrid';

// Update the interface to include the locationOption and propertyTypeInfo props
interface PropertyDetailsTabsProps {
  property: Property;
  address: string;
  locationOption?: { id: number; name: string; description?: string } | null;
  propertyTypeInfo?: { id: string; name: string; description: string } | null;
}

const PropertyDetailsTabs: React.FC<PropertyDetailsTabsProps> = ({ 
  property, 
  address, 
  locationOption,
  propertyTypeInfo
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'reviews'>('details');

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex p-2 bg-custom-cream/30">
        {[
          { id: 'details', label: 'Details' },
          { id: 'location', label: 'Location' },
          { id: 'reviews', label: 'Reviews' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-custom-terra shadow-sm'
                : 'text-custom-charcoal hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-custom-dark mb-4">Property Details</h2>
              <p className="text-custom-charcoal leading-relaxed mb-6">
                {property.description || 'No description provided for this property.'}
              </p>

              {/* Property & Location Info - New Simplified Version */}
              <div className="space-y-8 mb-8">
                {/* Property Type Information - Simplified */}
                {propertyTypeInfo && (
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FaHome className="text-custom-terra text-xl" />
                      <h3 className="text-xl font-semibold text-custom-dark">
                        Property Type: <span className="text-custom-terra">{propertyTypeInfo.name}</span>
                      </h3>
                    </div>
                    <p className="text-custom-charcoal mb-4">{propertyTypeInfo.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-custom-charcoal">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                        <span>Luxury Living</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                        <span>Premium Features</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                        <span>Privacy & Space</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Type Information - Simplified */}
                {locationOption && (
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FaMapMarkerAlt className="text-custom-sage text-xl" />
                      <h3 className="text-xl font-semibold text-custom-dark">
                        Location Type: <span className="text-custom-sage">{locationOption.name}</span>
                      </h3>
                    </div>
                    <p className="text-custom-charcoal mb-4">{locationOption.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-custom-charcoal">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                        <span>Tranquil Setting</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                        <span>Natural Beauty</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                        <span>Peaceful Retreat</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-custom-dark mb-3">Amenities</h3>
              <AmenitiesGrid amenities={property.amenities} />
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-custom-dark mb-4">Location</h2>
              <p className="text-custom-charcoal mb-4">
                <strong>Address:</strong> {address}
              </p>
              
              {/* Display location type if available */}
              {locationOption && (
                <p className="text-custom-charcoal mb-6">
                  <strong>Location Type:</strong> {locationOption.name}
                </p>
              )}
              
              <div className="h-[400px] bg-custom-cream/30 rounded-lg overflow-hidden">
                <PropertyMap 
                  address={address}
                  location={property.location}
                  country={property.country || 'Australia'}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-custom-charcoal mb-2">Reviews coming soon</p>
                <p className="text-custom-charcoal/70 text-sm">Be the first to review this property</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetailsTabs;
