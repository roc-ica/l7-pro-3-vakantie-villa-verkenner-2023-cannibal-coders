import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaStar, FaBed, FaBath, FaMapMarkerAlt, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Property } from '../../../types/property';
import { propertyService } from '../../../api/api';
import { formatPrice } from '../../../utils/formatters';
import { formatImageUrl, getPlaceholderForType } from '../../../utils/imageUtils';

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const propertiesPerPage = 3; // Number of properties visible per slide
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getProperties({ featured: true });
        setProperties(data);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  // Calculate the total number of pages
  const pageCount = Math.ceil(properties.length / propertiesPerPage);
  
  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + propertiesPerPage >= properties.length 
        ? 0 // Loop back to the start
        : prevIndex + propertiesPerPage
    );
  };
  
  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - propertiesPerPage < 0
        ? Math.max(0, properties.length - propertiesPerPage) // Go to the last slide
        : prevIndex - propertiesPerPage
    );
  };
  
  // Navigate to a specific page
  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * propertiesPerPage);
  };
  
  // Get the current page of properties
  const currentPageProperties = properties.slice(
    currentIndex,
    Math.min(currentIndex + propertiesPerPage, properties.length)
  );
  
  // Determine which page we're on (for pagination dots)
  const currentPage = Math.floor(currentIndex / propertiesPerPage);
  
  if (loading) {
    return (
      <section className="py-16 bg-custom-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-custom-dark">Featured Properties</h2>
            <p className="mt-4 text-custom-charcoal">Loading featured properties...</p>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-terra"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || properties.length === 0) {
    return null; // Don't show section if no featured properties or error
  }

  return (
    <section className="py-16 bg-custom-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-custom-dark">Featured Properties</h2>
            <p className="mt-2 text-custom-charcoal">Our hand-picked selection of premium accommodations</p>
          </div>
          
          <Link to="/properties" className="hidden md:flex items-center text-custom-terra hover:text-custom-sage transition-colors">
            <span className="mr-2">View all properties</span>
            <FaArrowRight />
          </Link>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Navigation (only shown if more than one page) */}
          {pageCount > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg text-custom-dark hover:text-custom-terra focus:outline-none"
                aria-label="Previous properties"
              >
                <FaAngleLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg text-custom-dark hover:text-custom-terra focus:outline-none"
                aria-label="Next properties"
              >
                <FaAngleRight size={20} />
              </button>
            </>
          )}
          
          {/* Carousel Items */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentPageProperties.map((property) => (
                  <FeaturedPropertyCard key={property.id} property={property} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Pagination Dots (only shown if more than one page) */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage 
                      ? "w-8 bg-custom-terra" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Mobile "View All" Link */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/properties"
            className="inline-flex items-center justify-center text-custom-terra hover:text-custom-sage transition-colors"
          >
            <span className="mr-2">View all properties</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Featured Property Card Component
const FeaturedPropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <Link 
      to={`/property/${property.id}`}
      className="block group h-full"
    >
      <motion.div 
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full flex flex-col relative"
        whileHover={{ y: -6 }}
      >
        {/* Enhanced Featured Badge */}
        <motion.div 
          className="absolute top-3 left-3 z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full flex items-center shadow-lg">
            <FaStar className="mr-1.5 text-white text-xs" /> 
            <span className="font-medium text-xs tracking-wide">FEATURED</span>
          </div>
        </motion.div>
        
        {/* Property Image */}
        <div className="relative h-48">
          <img 
            src={formatImageUrl(property.image_url)} 
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placeholder')) {
                target.src = getPlaceholderForType('property');
                target.onerror = null;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Property Content */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-custom-dark group-hover:text-custom-terra transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center text-custom-charcoal text-sm">
              <FaMapMarkerAlt className="mr-1 text-custom-terra" />
              <span>{property.location}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            <div className="font-semibold text-custom-dark">
              {formatPrice(
                typeof property.price === 'string' 
                ? parseFloat(property.price) 
                : property.price as number
              )}
              <span className="text-xs font-normal text-gray-500">/night</span>
            </div>
            
            <div className="flex items-center space-x-2 text-custom-charcoal text-sm">
              <div className="flex items-center">
                <FaBed className="mr-1 text-custom-sage" />
                {property.bedrooms}
              </div>
              <div className="flex items-center">
                <FaBath className="mr-1 text-custom-sage" />
                {property.bathrooms}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default FeaturedProperties;
