import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaArrowRight, 
  FaArrowLeft, 
  FaUmbrellaBeach, 
  FaMountain, 
  FaCity, 
  FaTree, 
  FaSpinner,
  FaHome,
  FaWifi,
  FaSwimmingPool
} from 'react-icons/fa';
import { PropertyFilter } from '../../../types/property';
import { amenities } from '../../../data/amenities'; // Import from data folder
import { propertyTypes } from '../../../data/options'; // Import from data folder
import { locationOptionsService } from '../../../api/api';

// Create an interface for location options
interface LocationOption {
  id: number;
  name: string;
  description?: string;
  icon?: React.ElementType;
  color?: string;
}

interface InteractiveSearchProps {
  onSearch: (filters: PropertyFilter) => void;
}

const InteractiveSearch: React.FC<InteractiveSearchProps> = ({ onSearch }) => {
  const [step, setStep] = useState<number>(1);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter amenities to get important ones
  const selectedAmenities = amenities
    .filter(a => ['pool', 'wifi', 'beachaccess', 'mountain_view'].includes(a.id))
    .map(a => ({ value: a.id, label: a.label, icon: a.icon }));

  // Fetch location options on component mount
  useEffect(() => {
    const fetchLocationOptions = async () => {
      setIsLoading(true);
      try {
        const options = await locationOptionsService.getLocationOptions();
        
        // Map each location option to include an icon and color
        const mappedOptions = options.map(option => {
          let icon = FaUmbrellaBeach;
          let color = 'bg-custom-terra';
          
          // Match location names to appropriate icons and colors
          if (option.name.toLowerCase().includes('beach')) {
            icon = FaUmbrellaBeach;
            color = 'bg-blue-500';
          } else if (option.name.toLowerCase().includes('mountain')) {
            icon = FaMountain;
            color = 'bg-custom-sage';
          } else if (option.name.toLowerCase().includes('city')) {
            icon = FaCity;
            color = 'bg-custom-charcoal';
          } else if (option.name.toLowerCase().includes('country')) {
            icon = FaTree;
            color = 'bg-green-600';
          }
          
          return {
            ...option,
            icon,
            color
          };
        });
        
        setLocationOptions(mappedOptions);
      } catch (error) {
        console.error('Error fetching location options:', error);
        // Fallback options
        setLocationOptions([
          { id: 1, name: 'Beach Front', description: 'Beach properties', icon: FaUmbrellaBeach, color: 'bg-blue-500' },
          { id: 2, name: 'Mountain View', description: 'Mountain properties', icon: FaMountain, color: 'bg-custom-sage' },
          { id: 3, name: 'City Center', description: 'City properties', icon: FaCity, color: 'bg-custom-charcoal' },
          { id: 4, name: 'Countryside', description: 'Rural properties', icon: FaTree, color: 'bg-green-600' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocationOptions();
  }, []);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleLocationSelect = (location: LocationOption) => {
    setFilters({ 
      ...filters, 
      location: location.name,
      locationOptionId: location.id 
    });
    handleNext();
  };

  const handlePropertyTypeSelect = (propertyType: string) => {
    setFilters({ ...filters, propertyType });
    handleNext();
  };

  const handleGuestsChange = (guests: number) => {
    setFilters({ ...filters, capacity: guests });
    handleNext();
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    setFilters({ ...filters, amenities: newAmenities });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  // Variants for animations
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className="fixed inset-0 bg-custom-dark/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-5xl mx-auto relative"
      >
        {/* Progress indicator */}
        <div className="absolute left-0 right-0 top-6 px-8">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-custom-terra"
              initial={{ width: '25%' }}
              animate={{ width: `${step * 25}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-white/60 text-xs">
            <span>Location</span>
            <span>Property Type</span>
            <span>Guests</span>
            <span>Amenities</span>
          </div>
        </div>

        {/* Content container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 pt-20 mt-20 mx-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.4 }}
              className="min-h-[400px] flex flex-col"
            >
              {step === 1 && (
                <div className="text-center flex-grow">
                  <h2 className="text-3xl font-bold text-custom-dark mb-2">Where would you like to go?</h2>
                  <p className="text-custom-charcoal mb-10">Choose your preferred location type</p>
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <FaSpinner className="text-4xl text-custom-terra animate-spin mb-4" />
                      <p className="text-custom-charcoal">Loading locations...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                      {locationOptions.map(location => {
                        const LocationIcon = location.icon || FaMapMarkerAlt;
                        return (
                          <motion.button
                            key={location.id}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLocationSelect(location)}
                            className={`${location.color || 'bg-custom-terra'} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-40 font-medium`}
                          >
                            <LocationIcon className="text-5xl mb-4" />
                            <span className="text-lg">{location.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {step === 2 && (
                <div className="text-center flex-grow">
                  <h2 className="text-3xl font-bold text-custom-dark mb-2">What type of property?</h2>
                  <p className="text-custom-charcoal mb-10">Select your preferred accommodation</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                    {propertyTypes.map(type => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePropertyTypeSelect(type.value)}
                        className={`p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-40
                          ${filters.propertyType === type.value 
                            ? 'bg-custom-terra text-white' 
                            : 'bg-white border-2 border-custom-cream hover:border-custom-terra/50'}`}
                      >
                        <FaHome className={`text-5xl mb-4 ${filters.propertyType === type.value ? 'text-white' : 'text-custom-terra'}`} />
                        <span className="text-lg">{type.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ x: -3 }}
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 text-custom-terra font-medium hover:underline mx-auto"
                  >
                    <FaArrowLeft size={14} /> Back to Location
                  </motion.button>
                </div>
              )}
              
              {step === 3 && (
                <div className="text-center flex-grow">
                  <h2 className="text-3xl font-bold text-custom-dark mb-2">How many guests?</h2>
                  <p className="text-custom-charcoal mb-10">Select the number of travelers</p>
                  
                  <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGuestsChange(num)}
                        className={`h-20 w-20 rounded-full flex items-center justify-center text-xl font-bold shadow-md
                          ${filters.capacity === num 
                            ? 'bg-custom-terra text-white' 
                            : 'bg-white border-2 border-custom-cream hover:border-custom-terra/50 text-custom-dark'}`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ x: -3 }}
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 text-custom-terra font-medium hover:underline mx-auto"
                  >
                    <FaArrowLeft size={14} /> Back to Property Type
                  </motion.button>
                </div>
              )}
              
              {step === 4 && (
                <div className="text-center flex-grow flex flex-col">
                  <h2 className="text-3xl font-bold text-custom-dark mb-2">Must-have amenities?</h2>
                  <p className="text-custom-charcoal mb-8">Select any amenities you can't live without</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                    {selectedAmenities.map(amenity => {
                      const isSelected = (filters.amenities || []).includes(amenity.value);
                      const AmenityIcon = amenity.icon;
                      return (
                        <motion.button
                          key={amenity.value}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAmenityToggle(amenity.value)}
                          className={`p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-32
                            ${isSelected
                              ? 'bg-custom-terra text-white'
                              : 'bg-white border-2 border-custom-cream hover:border-custom-terra/30'}`}
                        >
                          <AmenityIcon className={`text-3xl mb-3 ${isSelected ? 'text-white' : 'text-custom-terra'}`} />
                          <span className={`${isSelected ? 'text-white' : 'text-custom-dark'}`}>{amenity.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                      whileHover={{ x: -3 }}
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 text-custom-terra font-medium hover:underline"
                    >
                      <FaArrowLeft size={14} /> Back to Guests
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearch}
                      className="px-8 py-4 bg-custom-terra text-white rounded-xl font-bold hover:bg-custom-sage transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <FaSearch />
                      Find My Perfect Villa
                      <FaArrowRight className="ml-1" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Summary Bar */}
        <div className="bg-white/10 backdrop-blur-sm mt-6 p-4 rounded-xl border border-white/20 mx-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.location && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center gap-2 shadow-sm">
                <FaMapMarkerAlt />
                <span>{filters.location}</span>
              </div>
            )}
            
            {filters.propertyType && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center gap-2 shadow-sm">
                <FaHome />
                <span>{filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1)}</span>
              </div>
            )}
            
            {filters.capacity && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center gap-2 shadow-sm">
                <FaUsers />
                <span>{filters.capacity} Guest{filters.capacity !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {filters.amenities && filters.amenities.length > 0 && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center gap-2 shadow-sm">
                {filters.amenities.includes('pool') ? <FaSwimmingPool /> :
                 filters.amenities.includes('wifi') ? <FaWifi /> :
                 <FaSwimmingPool />}
                <span>{filters.amenities.length} Amenit{filters.amenities.length !== 1 ? 'ies' : 'y'}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveSearch;
