import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaTrash, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Property, PropertyType, PropertyStatus } from '../../../types/property';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: FormData) => Promise<void>;
  isEditing?: boolean;
  isSubmitting: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    name: '',
    location: '',
    country: '',
    address: '',
    capacity: 1,
    bedrooms: 1,
    bathrooms: 1,
    price: 0,
    description: '',
    amenities: '',
    property_type: 'villa',
    status: 'available',
    ...initialData
  });

  // For handling image uploads
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(
    initialData?.images?.map(img => img.image_url) || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAdditionalImages(prev => [...prev, ...filesArray]);
      
      // Create previews
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAdditionalImagePreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = "Property name is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.country?.trim()) newErrors.country = "Country is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = "Valid capacity is required";
    if (!formData.bedrooms || formData.bedrooms < 1) newErrors.bedrooms = "Valid bedrooms count is required";
    if (!formData.bathrooms || formData.bathrooms < 1) newErrors.bathrooms = "Valid bathrooms count is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!isEditing && !mainImage) newErrors.mainImage = "Main image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      // Create FormData object to handle file uploads
      const formDataToSubmit = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSubmit.append(key, value.toString());
        }
      });
      
      // Add main image if present
      if (mainImage) {
        formDataToSubmit.append('main_image', mainImage);
      }
      
      // Add additional images if present
      additionalImages.forEach((image, index) => {
        formDataToSubmit.append(`additional_images[${index}]`, image);
      });
      
      // Call the onSubmit function passed from parent
      await onSubmit(formDataToSubmit);
      
      // Redirect after success
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error submitting property:', error);
      setErrors({ 
        submit: 'Failed to save property. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-custom-cream/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-custom-dark">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Property Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name || ''}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="property_type" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Property Type*
              </label>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type || 'villa'}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="tent">Tent</option>
                <option value="loft">Loft</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Status*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'available'}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Price per Night (USD)*
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={handleNumberChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-custom-cream/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-custom-dark">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block mb-1 text-sm font-medium text-custom-charcoal">
                City/Area*
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location || ''}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Country*
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country || ''}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            {/* Full Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Full Address*
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address || ''}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-custom-cream/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-custom-dark">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Bedrooms*
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms || ''}
                onChange={handleNumberChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.bedrooms ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label htmlFor="bathrooms" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Bathrooms*
              </label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms || ''}
                onChange={handleNumberChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.bathrooms ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.bathrooms && (
                <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Guest Capacity*
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity || ''}
                onChange={handleNumberChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                           ${errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
              )}
            </div>

            {/* Amenities */}
            <div className="md:col-span-3">
              <label htmlFor="amenities" className="block mb-1 text-sm font-medium text-custom-charcoal">
                Amenities (comma-separated)*
              </label>
              <input
                id="amenities"
                name="amenities"
                type="text"
                placeholder="wifi,parking,pool,kitchen,etc"
                value={formData.amenities || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra"
              />
              <p className="mt-1 text-xs text-gray-500">
                E.g.: wifi,parking,pool,kitchen,ac,breakfast,pets,entertainment
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-custom-cream/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-custom-dark">Description</h2>
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-custom-charcoal">
              Property Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description || ''}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-custom-terra/30 focus:border-custom-terra
                          ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-custom-cream/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-custom-dark">Images</h2>
          
          {/* Main Image */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-custom-charcoal">
              Main Image{isEditing ? '' : '*'}
            </label>
            
            <div className="mt-2 flex flex-col items-center justify-center">
              {mainImagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={mainImagePreview}
                    alt="Main property"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all">
                  <FaImage size={36} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload main image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                </label>
              )}
              
              {errors.mainImage && (
                <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>
              )}
            </div>
          </div>
          
          {/* Additional Images */}
          <div>
            <label className="block mb-1 text-sm font-medium text-custom-charcoal">
              Additional Images (optional)
            </label>
            
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Existing images */}
              {additionalImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              
              {/* Upload new images */}
              <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all h-32">
                <FaPlus size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add more images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-custom-charcoal hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-terra/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
