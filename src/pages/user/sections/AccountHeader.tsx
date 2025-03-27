import React from 'react';
import { motion } from 'framer-motion';
import { FaPen, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

interface AccountHeaderProps {
  user: any;
  handleLogout: () => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ user }) => {
  // Generate patterns for the background
  const generatePattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/20"></div>
      <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white/15"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10"></div>
    </div>
  );
  
  return (
    <div className="bg-gradient-to-r from-custom-sage to-custom-terra text-white relative overflow-hidden">
      {/* Background patterns */}
      {generatePattern()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10">
          {/* Avatar section with animations */}
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-white/70 to-white/20 backdrop-blur-sm shadow-xl">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-custom-terra text-4xl font-bold shadow-inner">
                {user.username[0].toUpperCase()}
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-custom-cream transition-colors"
            >
              <FaPen className="text-custom-terra" size={14} />
            </motion.div>
            
            {/* Verified badge if user is verified */}
            {user.email_verified_at && (
              <div className="absolute -top-2 -right-2 bg-custom-cream p-1 rounded-full shadow-md">
                <FaCheckCircle className="text-custom-terra" size={18} />
              </div>
            )}
          </motion.div>
          
          {/* User information section */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <motion.h1 
                  className="text-3xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {user.username}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 text-white/80 mt-1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-white/60" size={14} />
                    {user.location || 'Location not set'}
                  </p>
                  <p className="hidden sm:block text-white/60">•</p>
                  <p>Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </motion.div>
              </div>
              
              {/* Quick stats */}
              <motion.div 
                className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="font-bold text-white text-xl">3</div>
                  <div className="text-white/70">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-xl">3</div>
                  <div className="text-white/70">Reviews</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle wave separator at bottom of header */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <svg className="absolute bottom-0 fill-custom-cream w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 40">
          <path d="M0,0V40H1440V0C1360,15 1280,30 1200,30C1120,30 1040,15 960,10C880,5 800,5 720,10C640,15 560,25 480,30C400,35 320,35 240,30C160,25 80,15 0,0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default AccountHeader;
