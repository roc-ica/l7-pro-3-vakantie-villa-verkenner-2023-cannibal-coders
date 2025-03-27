import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../../components/admin/AdminLayout';
import { propertyService } from '../../../api/api';
import { Property, PropertyFilter } from '../../../types/property';
import PropertyList from '../../../components/property/PropertyList';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const FeaturedPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Get only featured properties
      const data = await propertyService.getProperties({ featured: true });
      setProperties(data);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      toast.error('Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (property: Property) => {
    try {
      // Create FormData for the update
      const formData = new FormData();
      Object.entries(property).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'images') {
          formData.append(key, value.toString());
        }
      });
      
      // Set featured to false (removing from featured)
      formData.set('featured', '0');
      
      // Update the property
      await propertyService.updateProperty(property.id, formData);
      
      // Show success message
      toast.success(`${property.name} removed from featured properties`);
      
      // Refresh the list
      fetchFeaturedProperties();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Featured Properties">
      <div className="mb-6 flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold text-custom-dark flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaStar className="text-yellow-400 mr-2" />
          Featured Properties
        </motion.h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-custom-terra focus:border-custom-terra"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <motion.button
            onClick={() => navigate('/admin/properties')}
            className="px-4 py-2 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            Manage All Properties
          </motion.button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaStar className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-custom-dark mb-2">No Featured Properties</h2>
          <p className="text-custom-charcoal mb-4">
            You haven't marked any properties as featured yet.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            To feature a property, go to the All Properties page, edit a property, and check the "Featured Property" option.
          </p>
          <button
            onClick={() => navigate('/admin/properties')}
            className="px-4 py-2 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
          >
            Go to All Properties
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <p className="text-custom-charcoal">
              Featured properties are displayed prominently on the homepage and in search results.
              You currently have <span className="font-semibold text-custom-terra">{properties.length}</span> featured properties.
            </p>
          </div>
          
          {/* Property Cards with Remove Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="relative group">
                {/* Remove from featured button */}
                <button
                  onClick={() => handleToggleFeatured(property)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from featured"
                >
                  <FaTimes className="text-red-500" />
                </button>
                
                {/* Featured badge */}
                <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-white px-2 py-1 rounded-full flex items-center text-xs">
                  <FaStar className="mr-1" /> Featured
                </div>
                
                {/* Property Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={property.image_url} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-lg font-bold">{property.name}</h3>
                      <p className="text-sm">{property.location}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">${typeof property.price === 'string' ? parseFloat(property.price) : property.price}/night</span>
                      <span className="text-sm">{property.bedrooms} beds • {property.bathrooms} baths</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                        className="px-3 py-1 bg-custom-sage text-white rounded-md text-sm"
                      >
                        Edit Property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default FeaturedPropertiesPage;
