import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBed, FaDollarSign, FaCalendar } from 'react-icons/fa';

interface PropertyFeaturesProps {
  capacity: number;
  bedrooms: number;
  price: string;
  propertyType?: string;
  status?: string;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ capacity, bedrooms, price, status }) => {
  // Enhanced debugging to log when component renders and what props it receives
  useEffect(() => {
    console.log("PropertyFeatures component rendered with status:", status);
  }, [status]);
  
  // Function to determine the appropriate styling based on status
  const getStatusStyle = (status: string | undefined): { text: string, bg: string } => {
    if (!status) return { text: "text-custom-dark", bg: "bg-custom-cream/30" };
    
    switch(status.toLowerCase()) {
      case 'available':
        return { text: 'text-green-600', bg: 'bg-green-50' };
      case 'pending':
        return { text: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'sold':
        return { text: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { text: 'text-custom-dark', bg: 'bg-custom-cream/30' };
    }
  };
  
  const statusStyle = getStatusStyle(status);
  // Make sure we have a default display status if status is undefined or empty
  const displayStatus = status && status.trim() !== '' ? 
    status.charAt(0).toUpperCase() + status.slice(1) : 
    "Immediately";

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
      
      <div className={`flex flex-col items-center p-4 ${statusStyle.bg} rounded-lg`}>
        <FaCalendar className="text-2xl text-custom-terra mb-2" />
        <p className={`font-bold ${statusStyle.text}`}>{displayStatus}</p>
      </div>
    </motion.div>
  );
};

export default PropertyFeatures;
