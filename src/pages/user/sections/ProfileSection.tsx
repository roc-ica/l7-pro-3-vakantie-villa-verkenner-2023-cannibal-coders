import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaPen, FaCheck, FaTimes, FaHeart, FaCalendarAlt, FaStar } from 'react-icons/fa';

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
}

interface ProfileSectionProps {
  user: any;
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSaveProfile: (e: React.FormEvent) => void;
  mockFavorites: any[];
  mockReviews: any[];
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  profileData,
  setProfileData,
  isEditing,
  toggleEditing,
  handleSaveProfile,
  mockFavorites,
  mockReviews
}) => {
  return (
    <div className="space-y-8">
      {/* Personal Information Card */}
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
              onClick={toggleEditing}
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
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-2">Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-charcoal mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom-charcoal mb-2">Bio</label>
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
                  onClick={toggleEditing}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
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
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-custom-charcoal mb-2">About Me</h4>
                  <p className="text-custom-dark">{profileData.bio}</p>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-100 text-center py-6">
                  <p className="text-custom-charcoal">
                    You haven't added any information about yourself yet.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleEditing}
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
    </div>
  );
};

export default ProfileSection;
