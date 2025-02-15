import React, { useState } from 'react';
import { PropertyFilter } from '../../types/property';
import { FaSearch, FaEuroSign, FaBed, FaUsers, FaChevronDown, FaChevronUp, FaHome } from 'react-icons/fa';
import { amenities, getAmenitiesByCategory } from '../../data/amenities';
import { countries, propertyTypes } from '../../data/options';

interface PropertySearchProps {
  onSearch: (filters: PropertyFilter) => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    searchTerm: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    country: '',
    minBedrooms: undefined,
    minCapacity: undefined,
    amenities: [],
    propertyType: undefined,
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting filters:', filters);  // Debug log
    onSearch(filters);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    console.log('Setting property type:', value);  // Debug log
    setFilters({ ...filters, propertyType: value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    console.log('Setting country:', value);  // Debug log
    setFilters({ ...filters, country: value });
  };

  const amenitiesByCategory = getAmenitiesByCategory();
  const INITIAL_VISIBLE_ITEMS = 4;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Filters */}
        <div className="space-y-6">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Property name or keywords..."
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Property Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaHome className="inline mr-2" />
              Property Type
            </label>
            <select
              value={filters.propertyType || ''}
              onChange={handlePropertyTypeChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (€)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <FaEuroSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative">
                <FaEuroSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="City or region"
              value={filters.location || ''}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Show More Button */}
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full py-2 px-4 text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2 transition-colors"
        >
          {showAdvancedFilters ? (
            <>Show Less Filters <FaChevronUp /></>
          ) : (
            <>Show More Filters <FaChevronDown /></>
          )}
        </button>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-6 pt-4 border-t">
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={filters.country || ''}
                onChange={handleCountryChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBed className="inline mr-2" />
                  Min Bedrooms
                </label>
                <input
                  type="number"
                  min="1"
                  value={filters.minBedrooms || ''}
                  onChange={(e) => setFilters({ ...filters, minBedrooms: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-2" />
                  Min Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={filters.minCapacity || ''}
                  onChange={(e) => setFilters({ ...filters, minCapacity: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              {Object.entries(amenitiesByCategory).map(([category, categoryAmenities]) => (
                <div key={category} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-600 capitalize">
                      {category}
                    </h3>
                    {categoryAmenities.length > INITIAL_VISIBLE_ITEMS && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                      >
                        {expandedCategories[category] ? (
                          <>Show Less <FaChevronUp className="ml-1" /></>
                        ) : (
                          <>Show More <FaChevronDown className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryAmenities
                      .slice(0, expandedCategories[category] ? undefined : INITIAL_VISIBLE_ITEMS)
                      .map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleAmenityToggle(id)}
                          className={`flex items-center px-3 py-2 rounded-md text-sm ${
                            filters.amenities?.includes(id)
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          } border hover:bg-indigo-50 transition-colors`}
                        >
                          <Icon className="mr-2 flex-shrink-0" />
                          <span className="truncate">{label}</span>
                        </button>
                    ))}
                  </div>
                  {categoryAmenities.length > INITIAL_VISIBLE_ITEMS && !expandedCategories[category] && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{categoryAmenities.length - INITIAL_VISIBLE_ITEMS} more options
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default PropertySearch;
