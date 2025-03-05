import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaCalendarAlt, FaCog, FaPhone, FaEnvelope, FaIdCard, FaPen, FaCheck, FaTimes, FaSignOutAlt, FaTrash, FaShieldAlt, FaBell, FaStar } from 'react-icons/fa';

type TabType = 'profile' | 'favorites' | 'bookings' | 'settings';

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
  const mockFavorites = [];
  const mockBookings = [];
  const mockReviews = [];

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
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ] as const;

  const renderProfileContent = () => (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border-b border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-custom-dark">Personal Information</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isEditing 
                  ? 'bg-gray-100 text-custom-charcoal'
                  : 'bg-custom-terra/10 text-custom-terra'
              }`}
            >
              {isEditing ? (
                <span className="flex items-center">
                  <FaTimes className="mr-2" /> Cancel
                </span>
              ) : (
                <span className="flex items-center">
                  <FaPen className="mr-2" /> Edit Profile
                </span>
              )}
            </motion.button>
          </div>

          {isEditing ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom-charcoal mb-1">Bio</label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-custom-charcoal hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-all flex items-center"
                >
                  <FaCheck className="mr-2" /> Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <div className="flex items-center">
                    <FaUser className="text-custom-terra w-5 h-5 mr-2" />
                    <p className="text-sm text-custom-charcoal">Username</p>
                  </div>
                  <p className="text-custom-dark font-medium ml-7">{user.username}</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-custom-terra w-5 h-5 mr-2" />
                    <p className="text-sm text-custom-charcoal">Email</p>
                  </div>
                  <p className="text-custom-dark font-medium ml-7">{user.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaPhone className="text-custom-terra w-5 h-5 mr-2" />
                    <p className="text-sm text-custom-charcoal">Phone</p>
                  </div>
                  <p className="text-custom-dark font-medium ml-7">{profileData.phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <FaIdCard className="text-custom-terra w-5 h-5 mr-2" />
                    <p className="text-sm text-custom-charcoal">Member Since</p>
                  </div>
                  <p className="text-custom-dark font-medium ml-7">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {profileData.bio ? (
                <div className="pt-2 mt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-custom-charcoal mb-2">About Me</h4>
                  <p className="text-custom-dark">{profileData.bio}</p>
                </div>
              ) : (
                <div className="pt-2 mt-4 border-t border-gray-100 text-center py-6">
                  <p className="text-custom-charcoal">
                    You haven't added any information about yourself yet.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-custom-terra hover:underline text-sm font-medium flex items-center mx-auto"
                  >
                    <FaPen className="mr-1" /> Add Bio
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Activity Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {[
          { label: 'Favorites', icon: FaHeart, count: mockFavorites.length, color: 'from-pink-500 to-red-500' },
          { label: 'Bookings', icon: FaCalendarAlt, count: mockBookings.length, color: 'from-custom-sage to-custom-terra' },
          { label: 'Reviews', icon: FaStar, count: mockReviews.length, color: 'from-yellow-400 to-amber-500' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${item.color} p-4 flex items-center justify-between`}>
              <h3 className="text-white font-medium">{item.label}</h3>
              <item.icon className="text-white opacity-90" />
            </div>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-custom-dark mb-1">{item.count}</p>
              <p className="text-custom-charcoal text-sm">
                {item.label === 'Favorites' ? 'Saved properties' :
                 item.label === 'Bookings' ? 'Total reservations' : 
                 'Submitted reviews'}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const renderEmptyState = (type: string) => (
    <div className="bg-white rounded-xl p-8 text-center shadow-lg">
      <div className="bg-custom-cream/20 rounded-full p-6 inline-flex mb-4">
        {type === 'favorites' ? 
          <FaHeart className="text-4xl text-custom-terra/50" /> :
          <FaCalendarAlt className="text-4xl text-custom-terra/50" />
        }
      </div>
      <h3 className="text-xl font-medium text-custom-dark mb-2">
        No {type} yet
      </h3>
      <p className="text-custom-charcoal mb-4">
        {type === 'favorites' 
          ? 'You have not saved any properties to your favorites yet.'
          : 'You have not made any bookings yet.'
        }
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/properties')}
        className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
      >
        Explore Properties
      </motion.button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileContent();

      case 'favorites':
        return renderEmptyState('favorites');

      case 'bookings':
        return renderEmptyState('bookings');

      case 'settings':
        return (
          <div className="space-y-6">
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center mb-6">
                  <FaShieldAlt className="text-custom-terra mr-3" />
                  <h3 className="text-lg font-semibold text-custom-dark">Account Security</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-custom-dark font-medium">Password</h4>
                      <p className="text-sm text-custom-charcoal">Change your account password</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-custom-terra text-custom-terra rounded-lg hover:bg-custom-terra/5 transition-all text-sm font-medium"
                    >
                      Update Password
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-custom-dark font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-custom-charcoal">Add an extra layer of security</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-custom-sage/10 text-custom-sage rounded-lg hover:bg-custom-sage/20 transition-all text-sm font-medium"
                    >
                      Enable
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center mb-6">
                  <FaBell className="text-custom-terra mr-3" />
                  <h3 className="text-lg font-semibold text-custom-dark">Notifications</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 'email_deals', label: 'Promotional Emails', description: 'Receive emails about special deals and offers' },
                    { id: 'property_updates', label: 'Property Updates', description: 'Get notified when your favorite properties change' },
                    { id: 'booking_reminders', label: 'Booking Reminders', description: 'Receive reminders about your upcoming stays' }
                  ].map(preference => (
                    <div key={preference.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div>
                        <h4 className="text-custom-dark font-medium">{preference.label}</h4>
                        <p className="text-sm text-custom-charcoal">{preference.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={preference.id === 'booking_reminders'} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-custom-terra/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-terra"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <FaTrash className="text-red-500 mr-3" />
                  <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div>
                      <h4 className="text-red-700 font-medium">Delete Account</h4>
                      <p className="text-sm text-red-600">This will permanently delete your account and all data</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div>
                      <h4 className="text-amber-700 font-medium">Log Out</h4>
                      <p className="text-sm text-amber-600">Sign out from all devices</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium flex items-center justify-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Log Out
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-custom-cream">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* User Header */}
          <div className="bg-gradient-to-r from-custom-sage to-custom-terra text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-custom-terra text-3xl font-bold shadow-lg">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-custom-cream p-1 rounded-full shadow-md cursor-pointer hover:bg-white transition-colors">
                    <FaPen className="text-custom-terra" size={14} />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-white/80">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex justify-between overflow-x-auto">
                <div className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        py-4 px-6 inline-flex items-center border-b-2 font-medium transition-all
                        ${activeTab === tab.id
                          ? 'border-custom-terra text-custom-terra'
                          : 'border-transparent text-custom-charcoal hover:text-custom-dark hover:border-custom-cream'
                        }
                      `}
                    >
                      <tab.icon className={`mr-2 ${activeTab === tab.id ? 'text-custom-terra' : ''}`} />
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center py-4 px-6 text-custom-charcoal hover:text-custom-terra transition-colors"
                >
                  <FaSignOutAlt className="mr-2" />
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPage;
