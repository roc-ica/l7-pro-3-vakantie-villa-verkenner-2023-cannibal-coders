import React from 'react';
import { FaCheck, FaWifi, FaParking, FaSwimmingPool, FaSnowflake, FaUtensils, FaPaw, FaTv, FaWater, FaHiking, FaCocktail, FaUmbrellaBeach, FaHotTub } from 'react-icons/fa';

// Amenity icons mapping
const amenityIcons: Record<string, React.ElementType> = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  "swimming pool": FaSwimmingPool,
  ac: FaSnowflake,
  "air conditioning": FaSnowflake,
  kitchen: FaUtensils,
  pets: FaPaw,
  tv: FaTv,
  hottub: FaHotTub,
  "hot tub": FaHotTub,
  waterfront: FaWater,
  hiking: FaHiking,
  bar: FaCocktail,
  beach: FaUmbrellaBeach,
  // Add more mappings as needed
};

interface AmenitiesGridProps {
  amenities: string[] | string | undefined;
}

const AmenitiesGrid: React.FC<AmenitiesGridProps> = ({ amenities }) => {
  // Parse amenities into a standardized format
  const parseAmenities = (amenitiesData: string | string[] | undefined): string[] => {
    if (!amenitiesData) return [];
    
    // If amenitiesData is a string, try to parse it as a comma-separated list
    if (typeof amenitiesData === 'string') {
      return amenitiesData.split(',').map(item => item.trim());
    }
    
    // If it's already an array, return it
    if (Array.isArray(amenitiesData)) {
      return amenitiesData.map(item => item.trim());
    }
    
    return [];
  };

  // Get the appropriate icon for an amenity
  const getAmenityIcon = (amenity: string): React.ElementType => {
    // Check for exact matches
    if (amenityIcons[amenity.toLowerCase()]) {
      return amenityIcons[amenity.toLowerCase()];
    }
    
    // Check for partial matches
    const matchingKey = Object.keys(amenityIcons).find(key => 
      amenity.toLowerCase().includes(key) || key.includes(amenity.toLowerCase())
    );
    
    return matchingKey ? amenityIcons[matchingKey] : FaCheck;
  };

  const amenitiesList = parseAmenities(amenities);

  if (amenitiesList.length === 0) {
    return (
      <p className="text-custom-charcoal/70 italic">
        No amenities listed for this property.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {amenitiesList.map((amenity, i) => {
        // Get the appropriate icon component
        const IconComponent = getAmenityIcon(amenity);
        
        return (
          <div key={i} className="flex items-center gap-3 p-3 bg-custom-cream/20 rounded-lg">
            <div className="text-custom-terra">
              <IconComponent />
            </div>
            <span className="text-custom-dark capitalize">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AmenitiesGrid;
