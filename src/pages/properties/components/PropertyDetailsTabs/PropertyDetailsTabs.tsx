import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '../../../../types/property';
import PropertyMap from '../map/PropertyMap';
import AmenitiesGrid from '../AmenitiesGrid/AmenitiesGrid';

interface PropertyDetailsTabsProps {
  property: Property;
  address: string;
}

const PropertyDetailsTabs: React.FC<PropertyDetailsTabsProps> = ({ property, address }) => {
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
              <p className="text-custom-charcoal mb-6">
                <strong>Address:</strong> {address}
              </p>
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
