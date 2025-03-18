import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import AdminLayout from '../../../components/admin/AdminLayout';
import { propertyService } from '../../../api/api';
import { Property } from '../../../types/property';
import DeleteConfirmationModal from '../../../components/admin/modals/DeleteConfirmationModal';
import { formatPrice, formatDate } from '../../../utils/formatters';
import { formatImageUrl, getPlaceholderForType } from '../../../utils/imageUtils';

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

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

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      // Status filter
      if (filterStatus !== 'all' && property.status !== filterStatus) return false;
      
      // Search filter (case-insensitive)
      if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !property.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.country.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Handle different field types
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortField === 'created_at') {
        return sortDirection === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        const aValue = a[sortField as keyof Property]?.toString() || '';
        const bValue = b[sortField as keyof Property]?.toString() || '';
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <AdminLayout title="Manage Properties">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-4 flex-shrink-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra appearance-none bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
          
          <Link 
            to="/admin/properties/create"
            className="flex items-center gap-2 px-4 py-2 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
          >
            <FaPlus />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-terra"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-300 text-center">
          {error}
          <button 
            onClick={() => fetchProperties()} 
            className="block mx-auto mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-lg border border-gray-200 text-center">
          <h3 className="text-xl font-medium text-custom-dark mb-2">No properties found</h3>
          <p className="text-custom-charcoal mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? "Try adjusting your filters or search criteria"
              : "You haven't added any properties yet. Get started by adding your first property."}
          </p>
          <Link 
            to="/admin/properties/create" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-custom-terra text-white rounded-lg"
          >
            <FaPlus />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    <button 
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-2"
                    >
                      Property
                      {sortField === 'name' && (
                        <FaSort className={sortDirection === 'asc' ? "transform rotate-180" : ""} />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    <button 
                      onClick={() => toggleSort('location')}
                      className="flex items-center gap-2"
                    >
                      Location
                      {sortField === 'location' && (
                        <FaSort className={sortDirection === 'asc' ? "transform rotate-180" : ""} />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    <button 
                      onClick={() => toggleSort('price')}
                      className="flex items-center gap-2"
                    >
                      Price
                      {sortField === 'price' && (
                        <FaSort className={sortDirection === 'asc' ? "transform rotate-180" : ""} />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    <button 
                      onClick={() => toggleSort('status')}
                      className="flex items-center gap-2"
                    >
                      Status
                      {sortField === 'status' && (
                        <FaSort className={sortDirection === 'asc' ? "transform rotate-180" : ""} />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    <button 
                      onClick={() => toggleSort('created_at')}
                      className="flex items-center gap-2"
                    >
                      Created
                      {sortField === 'created_at' && (
                        <FaSort className={sortDirection === 'asc' ? "transform rotate-180" : ""} />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProperties.map((property) => (
                  <motion.tr 
                    key={property.id} 
                    className="hover:bg-gray-50"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-custom-cream/20 flex-shrink-0">
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
                          title="View property"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          to={`/admin/properties/edit/${property.id}`} 
                          className="p-2 text-custom-sage hover:bg-green-50 rounded-full"
                          title="Edit property"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(property)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete property"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-custom-charcoal">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>
      )}

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

export default AdminProperties;
