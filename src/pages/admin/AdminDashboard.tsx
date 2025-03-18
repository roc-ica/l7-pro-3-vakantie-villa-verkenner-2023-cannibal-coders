import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUsers, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaDollarSign } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Property } from '../../types/property';
import { propertyService } from '../../api/api';
import { formatPrice, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/admin/modals/DeleteConfirmationModal';
import { formatImageUrl, getPlaceholderForType } from '../../utils/imageUtils';

interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getProperties();
        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const recentProperties = properties.slice(0, 5);
  
  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setIsDeleting(true);
      await propertyService.deleteProperty(propertyToDelete.id);
      
      // Remove deleted property from state
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      
      toast.success(`Property "${propertyToDelete.name}" deleted successfully`);
      setPropertyToDelete(null);
    } catch (err) {
      console.error('Error deleting property:', err);
      toast.error('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setPropertyToDelete(null);
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Recent Properties */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-custom-dark">Recent Properties</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-custom-terra mb-3"></div>
              <p className="text-custom-charcoal">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Property</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Location</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Created</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-custom-cream/20">
                          {property.image_url && (
                            <img 
                              src={formatImageUrl(property.image_url)} 
                              alt={property.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placeholder')) {
                                  target.src = getPlaceholderForType('property');
                                  target.onerror = null;
                                }
                              }}
                            />
                          )}
                        </div>
                        <span className="font-medium text-custom-dark">{property.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-custom-charcoal">
                      {property.location}, {property.country}
                    </td>
                    <td className="py-4 px-6 text-custom-dark font-medium">
                      {formatPrice(property.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-custom-charcoal">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Link 
                          to={`/property/${property.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          to={`/admin/properties/edit/${property.id}`}
                          className="p-2 text-custom-sage hover:bg-green-50 rounded-full"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(property)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="p-4 border-t border-gray-100 text-right">
            <Link to="/admin/properties" className="text-custom-terra hover:underline text-sm">
              View all properties →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Links and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-custom-dark">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Add New Property', href: '/admin/properties/create', color: 'bg-custom-terra text-white' },
              { name: 'View All Properties', href: '/admin/properties', color: 'bg-custom-sage text-white' },
              { name: 'Dashboard', href: '/admin/dashboard', color: 'bg-blue-600 text-white' },
            ].map((link, i) => (
              <Link 
                key={i} 
                to={link.href}
                className={`block py-3 px-4 rounded-lg ${link.color} font-medium text-center hover:opacity-90 transition-opacity`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-custom-dark">Recent Activity</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-6">
              {[
                { user: 'John Doe', action: 'booked', property: 'Luxury Villa with Pool', time: '2 hours ago', icon: <FaCalendarAlt className="text-blue-500" /> },
                { user: 'Admin', action: 'added a new property', property: 'Beach House', time: '5 hours ago', icon: <FaHome className="text-green-500" /> },
                { user: 'Jane Smith', action: 'updated their profile', property: '', time: '1 day ago', icon: <FaUsers className="text-purple-500" /> },
                { user: 'Admin', action: 'changed status of', property: 'Mountain Retreat', time: '2 days ago', icon: <FaEdit className="text-custom-terra" /> },
              ].map((activity, i) => (
                <li key={i} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {activity.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-custom-dark">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      {activity.property && <span className="text-custom-terra">{activity.property}</span>}
                    </p>
                    <p className="text-sm text-custom-charcoal">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!propertyToDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Property"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
