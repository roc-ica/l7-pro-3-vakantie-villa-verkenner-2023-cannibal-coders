import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart, FaFilePdf, FaDownload } from 'react-icons/fa';
import { Property } from '../../../../types/property';
import { formatDate } from '../../../../utils/formatters';
import BookingTicketModal from '../../../../components/property/BookingTicketModal';
import { Ticket } from '../../../../types/ticket';
import { toast } from 'react-toastify';

interface PropertyBookingCardProps {
  property: Property;
  price: string;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
  locationOption?: { id: number; name: string; description?: string } | null;
  propertyTypeInfo?: { id: string; name: string; description: string } | null;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({ 
  property, 
  price, 
  isGeneratingPDF,
  onDownloadPDF,
  locationOption,
  propertyTypeInfo
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add logic to save to user's favorites
  };
  
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
