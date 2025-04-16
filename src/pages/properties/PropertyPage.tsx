import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/search/PropertySearch';
import { setProperties, setLoading } from './propertySlice';
import { propertyService } from '../../api/api';
import { PropertyFilter } from '../../types/property';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaSadTear, FaExclamationTriangle, FaSlidersH, FaTimes, FaSortAmountDown, FaThLarge, FaMap } from 'react-icons/fa';

const PropertyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, loading } = useAppSelector((state) => state.properties);
  const [error, setError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'map'>('grid');
  const [headerVisible, setHeaderVisible] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('default');
  const [originalProperties, setOriginalProperties] = useState<any[]>([]);

  const handleSearch = async (filters: PropertyFilter) => {
    try {
      setError(null);
      dispatch(setLoading(true));
      
      if (filters.location) {
        setSelectedLocation(filters.location);
      } else {
        setSelectedLocation(null);
      }
      
      const data = await propertyService.getProperties(filters);
      
      if (Array.isArray(data)) {
        // Save original data first
        setOriginalProperties(data);
        
        // Then apply sorting
        sortAndDispatchProperties(data);
        
        // Hide filters on mobile after search
        if (window.innerWidth < 1024) {
          setIsFilterVisible(false);
        }
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

  // Create a function to sort properties and dispatch them
  const sortAndDispatchProperties = (propsToSort: any[]) => {
    let sortedData = [...propsToSort];
    
    // Apply sorting
    switch(sortOption) {
      case 'price-asc':
        sortedData.sort((a, b) => {
          // Cast prices to numbers for comparison, handle non-numeric cases
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sortedData.sort((a, b) => {
          // Cast prices to numbers for comparison, handle non-numeric cases
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        sortedData.sort((a, b) => 
          (b.rating || 0) - (a.rating || 0)
        );
        break;
      // Default case keeps original order
      default:
        break;
    }
    
    dispatch(setProperties(sortedData));
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY < 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    handleSearch({});
  }, []);

  // Apply sorting when sort option changes without fetching new data
  useEffect(() => {
    if (originalProperties.length) {
      sortAndDispatchProperties(originalProperties);
    }
  }, [sortOption]);

  return (
    <div className="min-h-screen bg-custom-cream pb-16">
      {/* Page Header */}
      <motion.div 
        className="bg-gradient-to-r from-custom-sage to-custom-terra text-white py-16 md:py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/20"></div>
          <div className="absolute bottom-12 -left-32 w-96 h-96 rounded-full bg-white/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {selectedLocation ? (
                <>Properties in <span className="text-custom-cream">{selectedLocation}</span></>
              ) : (
                <>Find Your Perfect Villa</>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Discover luxurious properties across Australia's most stunning locations
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Filter Toggle */}
      <motion.div 
        className="sticky top-16 z-10 lg:hidden bg-white shadow-md"
        animate={{ 
          y: headerVisible ? 0 : -10,
          opacity: headerVisible ? 1 : 0.8
        }}
      >
        <button 
          onClick={() => setIsFilterVisible(!isFilterVisible)} 
          className="w-full flex items-center justify-center gap-2 py-4 text-custom-dark font-medium"
        >
          <FaSlidersH className="text-custom-terra" />
          {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <AnimatePresence>
            {(isFilterVisible || window.innerWidth >= 1024) && (
              <motion.div 
                className="lg:w-1/4 bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-custom-dark">Filters</h2>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterVisible(false)}
                    className="lg:hidden p-2 text-custom-charcoal hover:text-custom-terra"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
                <PropertySearch onSearch={handleSearch} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Property List */}
          <motion.div 
            className="lg:w-3/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* View Toggles & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"></div>
              <div className="flex justify-between items-center w-full mb-6">
                <div className="text-custom-dark">
                  <span className="font-medium">{properties.length} properties</span>
                  <span className="text-custom-charcoal ml-2">found for you</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded-lg shadow-sm p-1 flex">
                  <button 
                    onClick={() => setActiveView('grid')}
                    className={`px-4 py-2 rounded ${activeView === 'grid' 
                      ? 'bg-custom-terra text-white' 
                      : 'text-custom-charcoal hover:text-custom-terra'}`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setActiveView('map')}
                    className={`px-4 py-2 rounded ${activeView === 'map' 
                      ? 'bg-custom-terra text-white' 
                      : 'text-custom-charcoal hover:text-custom-terra'}`}
                  >
                    Map
                  </button>
                </div>
                
                <select 
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-custom-terra/20"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <motion.div 
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-3" />
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}
            
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-lg p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-custom-cream border-t-custom-terra rounded-full mb-4"
                />
                <p className="text-custom-charcoal">Searching for your perfect getaway...</p>
              </div>
            ) : properties.length > 0 ? (
              <PropertyList properties={properties} view={activeView} />
            ) : (
              <motion.div 
                className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaSadTear className="text-5xl text-custom-gray mb-4" />
                <h3 className="text-xl font-semibold text-custom-dark mb-2">No properties found</h3>
                <p className="text-custom-charcoal text-center mb-4">
                  Try adjusting your filters or searching for a different location.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch({})}
                  className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
