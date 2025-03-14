import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/search/PropertySearch';
import { setSearchTerm } from './searchSlice';
import { PropertyFilter } from '../../types/property';

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.search);
  const { properties } = useAppSelector((state) => state.properties);

  const handleSearch = (filters: PropertyFilter) => {
    dispatch(setSearchTerm(filters.location || ''));
    // Add additional search logic here
  };

  const filteredProperties = properties.filter(property => 
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Vacation Villas</h1>
      <PropertySearch onSearch={handleSearch} />
      <div className="mt-8">
        <PropertyList properties={filteredProperties} view="grid" />
      </div>
    </div>
  );
};

export default SearchPage;
