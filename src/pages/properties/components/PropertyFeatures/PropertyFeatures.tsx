import React from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaDollarSign, FaHome } from 'react-icons/fa';

interface PropertyFeaturesProps {
  bedrooms: number;
  capacity: number;
  price: string;
  propertyType?: string;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ bedrooms, capacity, price, propertyType }) => {
  return (
    <motion.div
      className="flex flex-wrap gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex-1 min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-custom-cream/30 p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-custom-terra/10 flex items-center justify-center">
            <FaUsers className="text-2xl text-custom-terra" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-custom-charcoal/70">Capacity</p>
            <p className="text-lg font-semibold text-custom-dark">{capacity} Guests</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-custom-cream/30 p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-custom-terra/10 flex items-center justify-center">
            <FaBed className="text-2xl text-custom-terra" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-custom-charcoal/70">Bedrooms</p>
            <p className="text-lg font-semibold text-custom-dark">{bedrooms}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-custom-cream/30 p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-custom-terra/10 flex items-center justify-center">
            <FaDollarSign className="text-2xl text-custom-terra" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-custom-charcoal/70">Price</p>
            <p className="text-lg font-semibold text-custom-dark">{price}/night</p>
          </div>
        </div>
      </div>

      {propertyType && (
        <div className="flex-1 min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-custom-cream/30 p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-custom-terra/10 flex items-center justify-center">
              <FaHome className="text-2xl text-custom-terra" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-custom-charcoal/70">Property Type</p>
              <p className="text-lg font-semibold text-custom-dark">{propertyType}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyFeatures;
