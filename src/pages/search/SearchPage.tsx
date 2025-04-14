import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaMagic } from 'react-icons/fa';
import PropertyList from '../../components/property/PropertyList';
import { propertyService } from '../../api/api';
import { Property, PropertyFilter } from '../../types/property';
import InteractiveSearch from './components/InteractiveSearch';
import AmenitiesFilter from './components/AmenitiesFilter';
import FeaturesFilter from './components/FeaturesFilter';
import LocationOptionsFilter from './components/LocationOptionsFilter';

const SearchPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [resultsFound, setResultsFound] = useState(true);
  const [showInteractiveSearch, setShowInteractiveSearch] = useState(false);

  // Fetch properties when filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await propertyService.getProperties(filters);
        setProperties(data);
        setResultsFound(data.length > 0);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(filters).length > 0) {
      fetchProperties();
    }
  }, [filters]);

  const handleSearch = (newFilters: PropertyFilter) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setShowInteractiveSearch(false);
    window.scrollTo({ top: document.getElementById('results')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Partial<PropertyFilter>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-custom-cream/20">
      {/* Interactive Search Modal (conditionally rendered) */}
      {showInteractiveSearch && (
        <InteractiveSearch onSearch={handleSearch} />
      )}
      
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-custom-sage to-custom-terra py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Your Dream Vacation Villa</h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Discover the perfect property for your next getaway with our interactive search.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInteractiveSearch(true)}
            className="px-8 py-4 bg-white text-custom-terra rounded-full shadow-lg font-bold text-lg flex items-center gap-2 mx-auto hover:bg-custom-cream transition-colors"
          >
            <FaMagic className="text-custom-terra" />
            Start Interactive Search
          </motion.button>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-custom-cream/20 to-transparent"></div>
        </div>
      </div>
      
      {/* Results Section */}
      <div id="results" className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="md:sticky md:top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-custom-dark">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-custom-terra hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full py-2 px-4 bg-white rounded-lg border border-custom-cream flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FaFilter className="text-custom-terra" />
                    <span className="font-medium">Filters</span>
                  </span>
                  <span>{showFilters ? '▲' : '▼'}</span>
                </button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <LocationOptionsFilter filters={filters} onChange={handleFilterChange} />
                <FeaturesFilter filters={filters} onChange={handleFilterChange} />
                <AmenitiesFilter filters={filters} onChange={handleFilterChange} />
              </div>
            </div>
          </div>
          
          {/* Properties Grid */}
          <div className="flex-grow">
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-custom-dark">
                  {isLoading 
                    ? 'Finding properties...' 
                    : properties.length > 0 
                      ? `${properties.length} Properties Found` 
                      : 'Properties'}
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowInteractiveSearch(true)}
                  className="px-4 py-2 bg-custom-terra text-white rounded-lg flex items-center gap-2 text-sm"
                >
                  <FaMagic />
                  Interactive Search
                </motion.button>
              </div>
              
              {Object.keys(filters).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {filters.location && (
                    <div className="bg-white px-3 py-1 rounded-full text-sm">
                      Location: {filters.location}
                    </div>
                  )}
                  {filters.propertyType && (
                    <div className="bg-white px-3 py-1 rounded-full text-sm">
                      Type: {filters.propertyType}
                    </div>
                  )}
                  {filters.capacity && (
                    <div className="bg-white px-3 py-1 rounded-full text-sm">
                      Guests: {filters.capacity}+
                    </div>
                  )}
                  {filters.amenities && filters.amenities.length > 0 && (
                    <div className="bg-white px-3 py-1 rounded-full text-sm">
                      Amenities: {filters.amenities.length}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-custom-cream border-t-custom-terra rounded-full"
                />
              </div>
            ) : !resultsFound && Object.keys(filters).length > 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-md">
                <FaSearch className="mx-auto text-5xl text-custom-terra/30 mb-4" />
                <h3 className="text-xl font-semibold text-custom-dark mb-2">No properties found</h3>
                <p className="text-custom-charcoal mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <PropertyList properties={properties} view="grid" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
