import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBed, FaDollarSign, FaCalendar } from 'react-icons/fa';

interface PropertyFeaturesProps {
  capacity: number;
  bedrooms: number;
  price: string;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ capacity, bedrooms, price }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
        <FaUsers className="text-2xl text-custom-terra mb-2" />
        <p className="text-sm text-custom-charcoal">Capacity</p>
        <p className="font-bold text-custom-dark">{capacity} persons</p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
        <FaBed className="text-2xl text-custom-terra mb-2" />
        <p className="text-sm text-custom-charcoal">Bedrooms</p>
        <p className="font-bold text-custom-dark">{bedrooms}</p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
        <FaDollarSign className="text-2xl text-custom-terra mb-2" />
        <p className="text-sm text-custom-charcoal">Price</p>
        <p className="font-bold text-custom-dark">{price}</p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
        <FaCalendar className="text-2xl text-custom-terra mb-2" />
        <p className="text-sm text-custom-charcoal">Available</p>
        <p className="font-bold text-custom-dark">Immediately</p>
      </div>
    </motion.div>
  );
};

export default PropertyFeatures;
