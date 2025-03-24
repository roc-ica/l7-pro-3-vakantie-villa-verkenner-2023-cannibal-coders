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
      <div className="grid grid-cols-2 gap-2">
        {amenityOptions.map(amenity => {
          const isChecked = (filters.amenities || []).includes(amenity.value);
          const AmenityIcon = amenity.icon;
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
              <AmenityIcon className="mr-1 text-sm" />
              <span className="text-sm">{amenity.label}</span>
            </button>
          );
        })}
      </div>
    </CollapsibleSection>
  );
};

export default AmenitiesFilter;
