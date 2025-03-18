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

              {/* Enhanced Property & Location Info Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Enhanced Property Type Information */}
                {propertyTypeInfo && (
                  <div className="bg-white border border-custom-terra/20 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-custom-terra/20 to-custom-terra/5 px-6 py-4 border-b border-custom-terra/10">
                      <h3 className="text-lg font-bold text-custom-dark flex items-center">
                        <FaHome className="mr-3 text-custom-terra" />
                        Property Type: {propertyTypeInfo.name}
                      </h3>
                    </div>
                    {propertyTypeInfo.description && (
                      <div className="p-6">
                        <p className="text-custom-charcoal">{propertyTypeInfo.description}</p>
                        <div className="mt-4 text-sm text-custom-charcoal/80 flex flex-wrap gap-4">
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                            Luxury Living
                          </span>
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                            Premium Features
                          </span>
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-terra rounded-full mr-2"></span>
                            Privacy & Space
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Location Type Information */}
                {locationOption && (
                  <div className="bg-white border border-custom-sage/20 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-custom-sage/20 to-custom-sage/5 px-6 py-4 border-b border-custom-sage/10">
                      <h3 className="text-lg font-bold text-custom-dark flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-custom-sage" />
                        Location Type: {locationOption.name}
                      </h3>
                    </div>
                    {locationOption.description && (
                      <div className="p-6">
                        <p className="text-custom-charcoal">{locationOption.description}</p>
                        <div className="mt-4 text-sm text-custom-charcoal/80 flex flex-wrap gap-4">
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                            Tranquil Setting
                          </span>
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                            Natural Beauty
                          </span>
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-custom-sage rounded-full mr-2"></span>
                            Peaceful Retreat
                          </span>
                        </div>
                      </div>
                    )}
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
