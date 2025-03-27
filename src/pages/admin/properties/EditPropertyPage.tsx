import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/admin/AdminLayout';
import PropertyForm from '../../../components/admin/properties/PropertyForm';
import { propertyService } from '../../../api/api';
import { Property } from '../../../types/property';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean | number | File }>({});

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) return;
        
        const data = await propertyService.getPropertyById(parseInt(id));
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Update this function to handle both string and boolean values
  const handleInputChange = (e: { target: { name: string; value: string | boolean | number | File } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProperty = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (!id) throw new Error('No property ID provided');
      
      // Add ID to FormData
      formData.append('id', id);
      
      await propertyService.updateProperty(parseInt(id), formData);
    } catch (err) {
      setError('Failed to update property. Please try again.');
      console.error('Error updating property:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Property">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-terra"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !property) {
    return (
      <AdminLayout title="Edit Property">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-300">
          {error || 'Property not found'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit Property: ${property.name}`}>
      <motion.div>
        <PropertyForm
          initialData={property} 
          onSubmit={handleUpdateProperty} 
          isEditing={true}
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </AdminLayout>
  );
};

export default EditPropertyPage;
