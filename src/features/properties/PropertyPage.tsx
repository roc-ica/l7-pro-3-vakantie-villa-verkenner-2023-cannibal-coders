import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/PropertySearch';
import { setProperties, setLoading } from './propertySlice';
import { propertyService } from '../../services/api';
import { PropertyFilter } from '../../types/property';

const PropertyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, loading } = useAppSelector((state) => state.properties);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (filters: PropertyFilter) => {
    try {
      setError(null);
      dispatch(setLoading(true));
      const data = await propertyService.getProperties(filters);
      
      if (Array.isArray(data)) {
        dispatch(setProperties(data));
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <PropertySearch onSearch={handleSearch} />
        </div>
        
        <div className="lg:w-3/4">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
            {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            ) : (
            <PropertyList properties={properties} />
            )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
