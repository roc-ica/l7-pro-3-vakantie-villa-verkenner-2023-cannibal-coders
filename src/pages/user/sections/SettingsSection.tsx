import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaBell, FaTrash, FaSignOutAlt } from 'react-icons/fa';

interface SettingsSectionProps {
  handleLogout: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ handleLogout }) => {
  return (
    <div className="space-y-8">
      {/* Security Settings */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <FaShieldAlt className="text-xl text-custom-terra mr-3" />
            <h3 className="text-xl font-semibold text-custom-dark">Account Security</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100">
              <div className="mb-4 md:mb-0">
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
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
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
      
      {/* Notification Preferences */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <FaBell className="text-xl text-custom-terra mr-3" />
            <h3 className="text-xl font-semibold text-custom-dark">Notifications</h3>
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
      
      {/* Danger Zone */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaTrash className="text-xl text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-red-600">Danger Zone</h3>
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium whitespace-nowrap"
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
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium flex items-center justify-center whitespace-nowrap"
              >
                <FaSignOutAlt className="mr-2" /> Log Out
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;
