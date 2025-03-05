import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendar, FaUsers, FaCompass } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { heroService } from '../../../services/api';

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState<Array<{ url: string; location: string }>>([]);
  const [popularLocations, setPopularLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    guests: 1,
    showLocationDropdown: false,
    isSearching: false
  });

  // Add new state for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Add this new state near the other state declarations
  const [highlightWord, setHighlightWord] = useState(0);
  const highlightWords = ['Paradise', 'Adventure', 'Luxury', 'Dreams', 'Journey'];

  useEffect(() => {
    // ... existing data fetching code ...
    
    // Placeholder data for testing
    if (!backgroundImages.length) {
      setBackgroundImages([
        {
          url: "https://peakvisor.com/photo/SD/Western-Australia-one-most-beautiful-red-dirtroads-karijini-2125930958.jpg",
          location: "Gold Coast, Queensland"
        },
        {
          url: "https://www.visafirst.com/blog/wp-content/uploads/2020/09/australian-city-view.jpg",
          location: "Sydney Harbour, New South Wales"
        },
        {
          url: "https://www.celebritycruises.com/blog/content/uploads/2022/06/what-is-australia-known-for-the-12-apostles-gibson-steps.jpg",
          location: "Melbourne, Victoria"
        }
      ]);
      
      setPopularLocations([
        "Sydney, NSW",
        "Melbourne, VIC",
        "Brisbane, QLD",
        "Perth, WA",
        "Gold Coast, QLD"
      ]);
      
      setLoading(false);
    }
  }, [backgroundImages.length]);

  // Auto-rotate background images
  useEffect(() => {
    if (backgroundImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages]);

  // Preload the next image
  useEffect(() => {
    if (backgroundImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      const img = new Image();
      img.src = backgroundImages[nextIndex].url;
    }
  }, [currentImageIndex, backgroundImages]);

  // Add this effect after other useEffect hooks
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setHighlightWord((prev) => (prev + 1) % highlightWords.length);
    }, 3000);
    return () => clearInterval(wordTimer);
  }, []);

  // Enhanced loading state
  if (loading || backgroundImages.length === 0) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-custom-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-custom-terra mx-auto mb-4"></div>
          <p className="text-custom-cream text-lg">Loading amazing destinations...</p>
        </div>
      </div>
    );
  }

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, isSearching: true }));
    // Simulate search delay
    setTimeout(() => {
      setSearchParams(prev => ({ ...prev, isSearching: false }));
      // Handle search navigation here
    }, 1500);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={backgroundImages[currentImageIndex].url}
            alt={backgroundImages[currentImageIndex].location}
            onLoad={() => setImageLoaded(true)}
            className="object-cover w-full h-full transition-transform duration-10000 transform scale-105"
            style={{ transform: imageLoaded ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-custom-dark/70 via-custom-dark/50 to-custom-dark/70" />
        </motion.div>
      </AnimatePresence>

      {/* Location Indicator and Navigation Dots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-8 left-8 text-white z-20 bg-custom-dark/40 backdrop-blur-sm rounded-lg p-4 max-w-md"
      >
        <div className="flex items-center gap-3">
          <FaCompass className="text-2xl text-custom-terra" />
          <div>
            <p className="text-2xl font-medium">{backgroundImages[currentImageIndex].location}</p>
            <p className="text-sm text-custom-cream/80">
              {`Image ${currentImageIndex + 1} of ${backgroundImages.length}`}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-custom-terra scale-110' 
                : 'bg-white/50 hover:bg-custom-cream'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Title and Description */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Your Perfect
            <AnimatePresence mode="wait">
              <motion.span
                key={highlightWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="block text-custom-terra mt-2"
              >
                {highlightWords[highlightWord]}
              </motion.span>
            </AnimatePresence>
          </h1>
          
          <p className="text-xl md:text-2xl text-custom-cream mb-12 max-w-3xl mx-auto">
            Discover luxurious villas across Australia's most stunning locations
          </p>

          {/* Search Form */}
          <motion.div 
            className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-4xl mx-auto border border-custom-cream/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Location Search */}
              <div className="flex-1 relative group">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-terra" />
                  <input
                    type="text"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams(prev => ({ 
                      ...prev, 
                      location: e.target.value,
                      showLocationDropdown: true 
                    }))}
                    placeholder="Search location..."
                    className="w-full pl-10 pr-4 py-4 rounded-lg border-2 border-gray-200 
                             focus:border-custom-terra focus:ring-2 focus:ring-custom-terra/20 
                             transition-all group-hover:border-custom-terra/50"
                  />
                </div>

                {/* Enhanced Location Dropdown */}
                <AnimatePresence>
                  {searchParams.showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
                               shadow-xl z-50 border border-custom-cream overflow-hidden"
                    >
                      {popularLocations.map((location) => (
                        <button
                          key={location}
                          onClick={() => setSearchParams(prev => ({
                            ...prev,
                            location,
                            showLocationDropdown: false
                          }))}
                          className="w-full text-left px-4 py-3 hover:bg-custom-cream/30
                                   transition-colors flex items-center gap-2 border-b 
                                   border-gray-100 last:border-0"
                        >
                          <FaMapMarkerAlt className="text-custom-terra" />
                          <span className="text-custom-charcoal">{location}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Picker */}
              <div className="flex-1 relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-terra" />
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-10 pr-4 py-4 rounded-lg border-2 border-gray-200 
                           focus:border-custom-terra focus:ring-2 focus:ring-custom-terra/20
                           transition-all"
                />
              </div>

              {/* Guests Counter */}
              <div className="flex-1 relative">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-terra" />
                <select
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, guests: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-4 rounded-lg border-2 border-gray-200 
                           focus:border-custom-terra focus:ring-2 focus:ring-custom-terra/20
                           transition-all appearance-none"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>
                      {num} Guest{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <motion.button
                onClick={handleSearch}
                disabled={searchParams.isSearching}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full md:w-auto px-8 py-4 bg-custom-terra hover:bg-custom-sage 
                         text-white rounded-lg font-semibold transition-all duration-300 
                         flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {searchParams.isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSearch />
                  </motion.div>
                ) : (
                  <>
                    <FaSearch />
                    <span>Search</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            <span className="text-custom-cream/80">Popular searches:</span>
            {['Beachfront Villas', 'Sydney Apartments', 'Mountain Retreats'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchParams(prev => ({ ...prev, location: term }))}
                className="text-custom-cream hover:text-custom-terra transition-colors underline decoration-dotted"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
