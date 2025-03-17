import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { NavigateFunction } from 'react-router-dom';

interface BookingsSectionProps {
  navigate: NavigateFunction;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ navigate }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-12 text-center shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-custom-cream/20 rounded-full p-8 inline-flex mb-6">
        <FaCalendarAlt className="text-5xl text-custom-terra/50" />
      </div>
      <h3 className="text-2xl font-medium text-custom-dark mb-3">
        No bookings yet
      </h3>
      <p className="text-custom-charcoal mb-6 max-w-md mx-auto">
        You haven't made any bookings yet. Find the perfect vacation home for your next getaway!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/properties')}
        className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
      >
        Explore Properties
      </motion.button>
    </motion.div>
  );
};

export default BookingsSection;
