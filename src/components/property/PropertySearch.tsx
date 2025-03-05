import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaBed, FaUsers, FaTag, FaHome, FaFilter, FaWifi, FaSwimmingPool, FaParking, FaSnowflake, FaTv, FaBath, FaUmbrellaBeach, FaMountain } from 'react-icons/fa';
import { PropertyFilter } from '../../types/property';

interface PropertySearchProps {
  onSearch: (filters: PropertyFilter) => void;
  className?: string;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch, className }) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    location: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    propertyType: '',
    amenities: []
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    features: true,
    amenities: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'minPrice' || name === 'maxPrice') {
      // Convert to number or use 0 if empty
      const numValue = value === '' ? 0 : Number(value);
      setFilters(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const currentAmenities = prev.amenities || [];
      return {
        ...prev,
        amenities: currentAmenities.includes(amenity)
          ? currentAmenities.filter(a => a !== amenity)
          : [...currentAmenities, amenity]
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };
  
  const resetForm = () => {
    setFilters({
      location: '',
      minPrice: 0,
      maxPrice: 0,
      bedrooms: 0,
      propertyType: '',
      amenities: []
    });
    onSearch({});
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const propertyTypes = [
    { value: 'villa', label: 'Villa', icon: FaHome },
    { value: 'apartment', label: 'Apartment', icon: FaHome },
    { value: 'house', label: 'House', icon: FaHome },
    { value: 'cabin', label: 'Cabin', icon: FaHome },
  ];
  
  const amenityOptions = [
    { value: 'wifi', label: 'WiFi', icon: FaWifi },
    { value: 'pool', label: 'Pool', icon: FaSwimmingPool },
    { value: 'parking', label: 'Parking', icon: FaParking },
    { value: 'ac', label: 'Air Conditioning', icon: FaSnowflake },
    { value: 'tv', label: 'Smart TV', icon: FaTv },
    { value: 'beach_access', label: 'Beach Access', icon: FaUmbrellaBeach },
    { value: 'mountain_view', label: 'Mountain View', icon: FaMountain },
    { value: 'private_bathroom', label: 'Private Bathroom', icon: FaBath },
  ];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-terra" />
          <input
            id="location"
            name="location"
            type="text"
            value={filters.location}
            onChange={handleChange}
            placeholder="Where would you like to go?"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
          />
        </div>
      </div>
      
      {/* Price Range Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('price')}
        >
          <div className="flex items-center gap-2">
            <FaTag className="text-custom-terra" />
            <h3 className="font-medium text-custom-dark">Price Range</h3>
          </div>
          <motion.div 
            animate={{ rotate: expandedSections.price ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-custom-charcoal/70"
          >
            ▼
          </motion.div>
        </div>
        
        {expandedSections.price && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal">$</span>
                <input
                  name="minPrice"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
                />
              </div>
              <span className="text-custom-charcoal">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal">$</span>
                <input
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
                />
              </div>
            </div>
            
            {/* Price Range Slider (Visual Only) */}
            <div className="mt-4 px-2">
              <div className="h-2 bg-custom-cream/50 rounded-full relative">
                <div 
                  className="absolute h-2 left-1/4 right-1/2 bg-custom-terra rounded-full"
                  style={{
                    left: `${(filters.minPrice || 0) / 2000 * 100}%`,
                    right: `${100 - ((filters.maxPrice || 2000) / 2000 * 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-custom-charcoal">
                <span>$0</span>
                <span>$1000</span>
                <span>$2000+</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Features Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('features')}
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-custom-terra" />
            <h3 className="font-medium text-custom-dark">Property Features</h3>
          </div>
          <motion.div 
            animate={{ rotate: expandedSections.features ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-custom-charcoal/70"
          >
            ▼
          </motion.div>
        </div>
        
        {expandedSections.features && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid gap-4"
          >
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="flex items-center text-custom-dark text-sm mb-2">
                <FaBed className="mr-2 text-custom-sage" />
                Bedrooms
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms || 0}
                onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.value ? String(Number(e.target.value)) : '0' }})}
                className="w-full px-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra appearance-none bg-white"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, '6+'].map(num => (
                  <option key={num} value={num}>{num}+ Bedrooms</option>
                ))}
              </select>
            </div>
            
            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="flex items-center text-custom-dark text-sm mb-2">
                <FaUsers className="mr-2 text-custom-sage" />
                Guests
              </label>
              <select
                id="capacity"
                name="capacity"
                value={filters.capacity || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra appearance-none bg-white"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(num => (
                  <option key={num} value={num}>{num}+ Guests</option>
                ))}
              </select>
            </div>
            
            {/* Property Types */}
            <div>
              <label className="flex items-center text-custom-dark text-sm mb-2">
                <FaHome className="mr-2 text-custom-sage" />
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map(type => {
                  const isSelected = filters.propertyType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        propertyType: isSelected ? '' : type.value
                      }))}
                      className={`px-3 py-2 rounded-md text-left flex items-center transition-colors ${
                        isSelected 
                          ? 'bg-custom-terra/10 text-custom-terra border border-custom-terra/30' 
                          : 'bg-white border border-gray-200 text-custom-charcoal hover:bg-custom-cream/30'
                      }`}
                    >
                      <type.icon className="mr-2 text-sm" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Amenities Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('amenities')}
        >
          <div className="flex items-center gap-2">
            <FaWifi className="text-custom-terra" />
            <h3 className="font-medium text-custom-dark">Amenities</h3>
          </div>
          <motion.div 
            animate={{ rotate: expandedSections.amenities ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-custom-charcoal/70"
          >
            ▼
          </motion.div>
        </div>
        
        {expandedSections.amenities && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map(amenity => {
                const isChecked = (filters.amenities || []).includes(amenity.value);
                return (
                  <button
                    key={amenity.value}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.value)}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      isChecked 
                        ? 'bg-custom-terra/10 text-custom-terra border border-custom-terra/30'
                        : 'bg-white border border-gray-200 text-custom-charcoal hover:bg-custom-cream/30'
                    }`}
                  >
                    <div className={`w-4 h-4 mr-2 rounded-full transition-colors ${
                      isChecked ? 'bg-custom-terra' : 'bg-gray-200'
                    }`}></div>
                    <amenity.icon className="mr-1 text-sm" />
                    <span className="text-sm">{amenity.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-custom-terra text-white font-medium rounded-lg hover:bg-custom-terra/90 transition-colors flex items-center justify-center"
        >
          <FaSearch className="mr-2" />
          Search Properties
        </motion.button>
        
        <button
          type="button"
          onClick={resetForm}
          className="w-full py-3 border border-custom-charcoal/30 text-custom-charcoal rounded-lg hover:bg-custom-cream transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default PropertySearch;
