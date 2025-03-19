import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Property } from '../../types/property';

interface BookingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSubmitTicket: (name: string, question: string) => void;
}

const BookingTicketModal: React.FC<BookingTicketModalProps> = ({ isOpen, onClose, property, onSubmitTicket }) => {
  const [userName, setUserName] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim() || !question.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      onSubmitTicket(userName, question);
      toast.success('Your ticket has been submitted successfully!');
      setUserName('');
      setQuestion('');
      onClose();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit your ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-custom-dark">Book a Ticket</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes className="text-custom-charcoal" />
              </button>
            </div>

            <p className="text-custom-charcoal mb-4">
              Interested in <span className="font-semibold text-custom-terra">{property.name}</span>? 
              Submit your ticket and we'll get back to you shortly!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-custom-charcoal mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-medium text-custom-charcoal mb-1">
                  Your Question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra"
                  placeholder="What would you like to know about this property?"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-custom-terra text-white rounded-lg font-medium 
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-custom-terra/90'}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingTicketModal;
