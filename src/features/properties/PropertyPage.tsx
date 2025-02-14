import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/PropertySearch';
import { setProperties, setLoading } from './propertySlice';
import { propertyService } from '../../services/api';
import { PropertyFilter } from '../../types/property';

const PropertyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, loading } = useAppSelector((state) => state.properties);

  const handleSearch = async (filters: PropertyFilter) => {
    try {
      dispatch(setLoading(true));
      const data = await propertyService.getProperties(filters);
      dispatch(setProperties(data));
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Villa</h1>
      <PropertySearch onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="mt-8">
          <PropertyList properties={properties} />
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
