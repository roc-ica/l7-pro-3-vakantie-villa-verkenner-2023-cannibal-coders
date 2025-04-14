import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FilterComponentProps } from "../types";
import CollapsibleSection from './CollapsibleSection';
import { locationOptionsService } from '../../../api/api';

interface LocationOption {
  id: number;
  name: string;
  description: string;
}

const LocationOptionsFilter: React.FC<FilterComponentProps> = ({ filters, onChange }) => {
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch location options when component mounts
  useEffect(() => {
    const fetchLocationOptions = async () => {
      setIsLoading(true);
      try {
        const options = await locationOptionsService.getLocationOptions();
        setLocationOptions(options);
      } catch (error) {
        console.error('Error fetching location options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationOptions();
  }, []);

  const handleLocationClick = (optionId: number) => {
    // If already selected, deselect it
    if (filters.locationOptionId === optionId) {
      onChange({ locationOptionId: undefined });
    } else {
      // Otherwise select it
      onChange({ locationOptionId: optionId });
    }
  };

  return (
    <CollapsibleSection title="Location Type" icon={FaMapMarkerAlt} defaultExpanded={true}>
      {isLoading ? (
        <div className="text-center py-2">Loading location options...</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {locationOptions.map(option => {
            const isSelected = filters.locationOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleLocationClick(option.id)}
                title={option.description}
                className={`px-3 py-2 rounded-md text-left flex items-center transition-colors ${
                  isSelected 
                    ? 'bg-custom-terra/10 text-custom-terra border border-custom-terra/30' 
                    : 'bg-white border border-gray-200 text-custom-charcoal hover:bg-custom-cream/30'
                }`}
              >
                <div className={`w-4 h-4 mr-2 rounded-full transition-colors ${
                  isSelected ? 'bg-custom-terra' : 'bg-gray-200'
                }`}></div>
                <span className="text-sm">{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default LocationOptionsFilter;
