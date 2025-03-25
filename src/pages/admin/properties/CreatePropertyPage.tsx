import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/admin/AdminLayout';
import PropertyForm from './components/PropertyForm'; // Fixed import path
import { propertyService } from '../../../api/api';

const CreatePropertyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean | number | File }>({});
  const navigate = useNavigate();

  // Update this function to handle both string and boolean values
  const handleInputChange = (e: { target: { name: string; value: string | boolean | number | File } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData object from form state
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });
      
      await propertyService.createProperty(submitData);
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
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </motion.div>
    </AdminLayout>
  );
};

export default CreatePropertyPage;
