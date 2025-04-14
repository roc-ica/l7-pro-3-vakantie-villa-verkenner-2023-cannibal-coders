import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilePdf, FaSpinner, FaDownload, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Property } from '../../../../types/property';
import { formatDate } from '../../../../utils/formatters';
import BookingTicketModal from '../../../../components/property/BookingTicketModal';
import { Ticket } from '../../../../types/ticket';
import { toast } from 'react-toastify';
import FavoriteButton from '../../../../components/common/FavoriteButton'; // Import FavoriteButton
import { userService } from '../../../../api/api'; // Import userService

interface PropertyBookingCardProps {
  property: Property;
  price: string;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
  locationOption?: { id: number; name: string; description?: string } | null;
  propertyTypeInfo?: { id: string; name: string; description: string } | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({ 
  property, 
  price, 
  isGeneratingPDF,
  onDownloadPDF,
  locationOption,
  propertyTypeInfo,
  isFavorite = false,
  onToggleFavorite = () => {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleSubmitTicket = (name: string, question: string) => {
    // Create a new ticket
    const ticket: Ticket = {
      property_id: property.id,
      property_name: property.name,
      user_name: name,
      question: question,
      created_at: new Date().toISOString()
    };
    
    console.log('Submitted ticket:', ticket);
    // In a real application, you would save this to your backend
    
    toast.success('Your booking request has been submitted!');
    // You could also add logic here to store the ticket in localStorage or send it to an API
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
          <p className="text-sm uppercase tracking-wider mb-1">For</p>
          <p className="text-3xl font-bold">{price}</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenModal}
          className="w-full py-3 bg-custom-terra text-white rounded-lg font-semibold hover:bg-custom-sage transition-colors mb-3 flex items-center justify-center"
        >
          Book Now
        </motion.button>

        {/* Ticket Modal */}
        <BookingTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
          onSubmitTicket={handleSubmitTicket}
        />

        <motion.button 
          onClick={onDownloadPDF}
          disabled={isGeneratingPDF}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 border border-custom-sage text-custom-sage rounded-lg font-medium hover:bg-custom-sage/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mb-3"
        >
          {isGeneratingPDF ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4"
              >
                <FaSpinner />
              </motion.div>
              Generating PDF...
            </>
          ) : (
            <>
              <FaFilePdf /> Download PDF
            </>
          )}
        </motion.button>
        
        {/* Favorite Button */}
        <div className="w-full mb-3">
          {property && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center"
            >
              {userService.isLoggedIn() ? (
                <FavoriteButton 
                  propertyId={property.id} 
                  size="medium" 
                  showText={true} 
                  className="text-custom-charcoal"
                />
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 text-custom-charcoal"
                >
                  <FaRegHeart /> Login to Save Favorites
                </button>
              )}
            </motion.div>
          )}
        </div>

      </div>

      {/* Property Details */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-custom-dark">Property Details</h3>
        <ul className="space-y-3 text-custom-charcoal">
          {[
            { label: 'Property ID', value: property.id },
            { label: 'Type', value: propertyTypeInfo?.name || property.property_type },
            { label: 'Location Type', value: locationOption?.name || 'Standard' },
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
