// filepath: c:\Users\ivanr\OneDrive\Documenten\school\l7-pro-3-vakantie-villa-verkenner-2023-cannibal-coders\src\components\property\search\PropertySearch.tsx
import React, { useState, useEffect } from 'react';
import { PropertyFilter } from '../../../types/property';
import LocationSearch from './components/LocationSearch';
import PriceFilter from './components/PriceFilter';
import FeaturesFilter from './components/FeaturesFilter';
import AmenitiesFilter from './components/AmenitiesFilter';
import SearchActions from './components/SearchActions';
import LocationOptionsFilter from './components/LocationOptionsFilter';

interface PropertySearchProps {
  onSearch: (filters: PropertyFilter) => void;
  initialValues?: PropertyFilter;
  className?: string;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ 
  onSearch, 
  initialValues, 
  className = '' 
}) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    location: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    capacity: 0,
    propertyType: '',
    amenities: []
  });

  // Initialize with initial values when component mounts or initialValues change
  useEffect(() => {
    if (initialValues) {
      setFilters(prev => ({
        ...prev,
        ...initialValues
      }));
    }
  }, [initialValues]);

  const handleFilterChange = (newFilters: Partial<PropertyFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(filters);
  };

  const resetForm = () => {
    const emptyFilters = {
      location: '',
      minPrice: 0,
      maxPrice: 0,
      bedrooms: 0,
      capacity: 0,
      propertyType: '',
      amenities: []
    };
    setFilters(emptyFilters);
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <LocationSearch 
        filters={filters} 
        onChange={handleFilterChange} 
      />
      
      <PriceFilter 
        filters={filters} 
        onChange={handleFilterChange} 
      />
      
      <FeaturesFilter 
        filters={filters} 
        onChange={handleFilterChange} 
      />
      
      <AmenitiesFilter 
        filters={filters} 
        onChange={handleFilterChange} 
      />

      <LocationOptionsFilter
        filters={filters}
        onChange={handleFilterChange}
      />
      
      <SearchActions 
        onSearch={handleSubmit} 
        onReset={resetForm} 
      />
    </form>
  );
};

export default PropertySearch;