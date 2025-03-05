import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart, FaFilePdf, FaDownload } from 'react-icons/fa';
import { Property } from '../../../../types/property';
import { formatDate } from '../../../../utils/formatters';

interface PropertyBookingCardProps {
  property: Property;
  price: string;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({ 
  property, 
  price, 
  isGeneratingPDF,
  onDownloadPDF
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add logic to save to user's favorites
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Price Header */}
      <div className="bg-gradient-to-r from-custom-sage to-custom-terra p-6 text-white">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider mb-1">From</p>
          <p className="text-3xl font-bold">{price}</p>
          <p className="text-sm opacity-80">per night</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-custom-charcoal text-sm mb-2">Check-in Date</label>
          <input 
            type="date"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
          />
        </div>

        <div className="mb-4">
          <label className="block text-custom-charcoal text-sm mb-2">Check-out Date</label>
          <input 
            type="date"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
          />
        </div>

        <div className="mb-6">
          <label className="block text-custom-charcoal text-sm mb-2">Guests</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-custom-terra text-white rounded-lg font-semibold hover:bg-custom-sage transition-colors mb-3 flex items-center justify-center"
        >
          Book Now
        </motion.button>

        <div className="flex gap-2 mb-3">
          <button 
            onClick={toggleFavorite}
            className="flex-1 py-3 border border-custom-terra text-custom-terra rounded-lg font-medium hover:bg-custom-cream/30 transition-colors flex items-center justify-center gap-2"
          >
            {isFavorite ? (
              <>
                <FaHeart /> Saved
              </>
            ) : (
              <>
                <FaRegHeart /> Save
              </>
            )}
          </button>
          
          <motion.button 
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3 border border-custom-sage text-custom-sage rounded-lg font-medium hover:bg-custom-sage/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4"
                >
                  <FaDownload />
                </motion.div>
                PDF...
              </>
            ) : (
              <>
                <FaFilePdf /> Download PDF
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Property Details */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-custom-dark">Property Details</h3>
        <ul className="space-y-3 text-custom-charcoal">
          {[
            { label: 'Property ID', value: property.id },
            { label: 'Type', value: property.property_type || 'Villa' },
            { label: 'Year Built', value: '2020' },
            { label: 'Last Updated', value: formatDate(property.updated_at || property.created_at) }
          ].map((detail, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-custom-charcoal/70">{detail.label}</span>
              <span className="font-medium">{detail.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PropertyBookingCard;
