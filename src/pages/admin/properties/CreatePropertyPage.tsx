import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/admin/AdminLayout';
// Update import path to use the correct component
import PropertyForm from '../../../components/admin/properties/PropertyForm';
import { propertyService } from '../../../api/api';

const CreatePropertyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await propertyService.createProperty(formData);
      toast.success('Property created successfully!');
      navigate('/admin/properties');
    } catch (err) {
      toast.error('Failed to create property. Please try again.');
      console.error('Error creating property:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Property">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PropertyForm 
          onSubmit={handleSubmit}
          isSubmitting={loading}
          isEditing={false}
        />
      </motion.div>
    </AdminLayout>
  );
};

export default CreatePropertyPage;
