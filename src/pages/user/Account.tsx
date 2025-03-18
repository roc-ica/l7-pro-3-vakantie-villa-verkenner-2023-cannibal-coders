import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaCalendarAlt, FaCog, FaPhone, FaEnvelope, FaIdCard, 
  FaPen, FaCheck, FaTimes, FaSignOutAlt, FaTrash, FaShieldAlt, FaBell, FaStar } from 'react-icons/fa';

// Section components
import AccountHeader from './sections/AccountHeader';
import AccountTabs from './sections/AccountTabs';
import ProfileSection from './sections/ProfileSection';
import FavoritesSection from './sections/FavoritesSection';
import SettingsSection from './sections/SettingsSection';

type TabType = 'profile' | 'favorites' | 'settings';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-custom-cream">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-custom-cream border-t-custom-terra rounded-full mb-4 mx-auto"
      />
      <p className="text-custom-charcoal">Loading your account...</p>
    </div>
  </div>
);

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });

  // Mock data - would come from API in a real app
  const mockFavorites = [
    { id: 1, title: 'Modern Beach House', location: 'Malibu, CA', price: 350, rating: 4.8, image: '/img/beach-house.jpg' },
    { id: 2, title: 'Mountain Cabin', location: 'Aspen, CO', price: 275, rating: 4.5, image: '/img/mountain-cabin.jpg' },
    { id: 3, title: 'Urban Condo', location: 'Seattle, WA', price: 200, rating: 4.2, image: '/img/urban-condo.jpg' }
  ];
  const mockReviews = [
    { id: 1, title: 'Modern Beach House', location: 'Malibu, CA', price: 350, rating: 4.8, image: '/img/beach-house.jpg', review: 'Great place to stay, would definitely come back!' },
    { id: 2, title: 'Mountain Cabin', location: 'Aspen, CO', price: 275, rating: 4.5, image: '/img/mountain-cabin.jpg', review: 'Beautiful views and cozy atmosphere.' },
    { id: 3, title: 'Urban Condo', location: 'Seattle, WA', price: 200, rating: 4.2, image: '/img/urban-condo.jpg', review: 'Perfect location and very clean.' }
  ];

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      if (!user) {
        navigate('/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ] as const;

  // Toggle editing state
  const toggleEditing = () => setIsEditing(!isEditing);

  // Handle form save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-custom-cream">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col">
          {/* Header Section with User Info */}
          <AccountHeader 
            user={user} 
            handleLogout={handleLogout}
          />
          
          {/* Tab Navigation */}
          <AccountTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={(tab: TabType) => setActiveTab(tab)} 
            handleLogout={handleLogout}
          />

          {/* Tab Content Container */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && (
                  <ProfileSection 
                    user={user} 
                    profileData={profileData}
                    setProfileData={setProfileData}
                    isEditing={isEditing}
                    toggleEditing={toggleEditing}
                    handleSaveProfile={handleSaveProfile}
                    mockReviews={mockReviews}
                    mockFavorites={mockFavorites}
                  />
                )}

                {activeTab === 'favorites' && (
                  <FavoritesSection navigate={navigate} />
                )}

                {activeTab === 'settings' && (
                  <SettingsSection handleLogout={handleLogout} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
