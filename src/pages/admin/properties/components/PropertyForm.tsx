import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import FormSection from './FormSection';

interface PropertyFormProps {
  formData: any;
  handleInputChange: (event: { target: { name: string, value: string | boolean | number | File } }) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  formData, 
  handleInputChange, 
  handleSubmit 
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <FormSection title="Basic Information">
        {/* Name field */}
        <div className="col-span-6 lg:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Property Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="mt-1 focus:ring-custom-terra focus:border-custom-terra block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        
        {/* Featured Property Toggle */}
        <div className="col-span-6">
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.featured || false}
              onChange={(checked) => handleInputChange({ target: { name: 'featured', value: checked } })}
              className={`${
                formData.featured ? 'bg-custom-terra' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-custom-terra focus:ring-offset-2`}
            >
              <span
                className={`${
                  formData.featured ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              Featured Property
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Featured properties will be highlighted on the homepage and in search results.
          </p>
        </div>
      </FormSection>
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-custom-terra text-white rounded-md hover:bg-custom-sage transition-colors"
        >
          Save Property
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;