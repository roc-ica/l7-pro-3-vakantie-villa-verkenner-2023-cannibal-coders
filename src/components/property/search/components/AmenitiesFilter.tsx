// filepath: c:\Users\ivanr\OneDrive\Documenten\school\l7-pro-3-vakantie-villa-verkenner-2023-cannibal-coders\src\components\property\search\AmenitiesFilter.tsx
import React from 'react';
import { FaWifi, FaSwimmingPool, FaParking, FaSnowflake, FaTv, FaBath, FaUmbrellaBeach, FaMountain } from 'react-icons/fa';
import { FilterComponentProps } from '../types';
import CollapsibleSection from './CollapsibleSection';

const AmenitiesFilter: React.FC<FilterComponentProps> = ({ filters, onChange }) => {
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
  
  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    
    onChange({ amenities: newAmenities });
  };
  
  return (
    <CollapsibleSection title="Amenities" icon={FaWifi} defaultExpanded={true}>
      <div className="grid grid-cols-2 gap-3">
        {amenityOptions.map(amenity => {
          const isChecked = (filters.amenities || []).includes(amenity.value);
          const AmenityIcon = amenity.icon;
          return (
            <button
              key={amenity.value}
              type="button"
              onClick={() => handleAmenityToggle(amenity.value)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow ${
                isChecked 
                  ? 'bg-custom-terra/20 text-custom-terra border-2 border-custom-terra/50 font-medium'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-custom-cream/20'
              }`}
            >
              <AmenityIcon className={`text-lg mr-2 ${isChecked ? 'text-custom-terra' : 'text-gray-400'}`} />
              <span className={`${isChecked ? 'font-medium' : ''}`}>{amenity.label}</span>
            </button>
          );
        })}
      </div>
    </CollapsibleSection>
  );
};

export default AmenitiesFilter;