import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FilterComponentProps } from "../types";
import CollapsibleSection from './CollapsibleSection';
import { locationOptionsService } from '../../../../api/api';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Convert empty string to undefined, otherwise convert to number
    onChange({ locationOptionId: value ? parseInt(value) : undefined });
  };

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
        <div className="grid grid-cols-2 gap-3">
          {locationOptions.map(option => {
            const isSelected = filters.locationOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleLocationClick(option.id)}
                title={option.description}
                className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow ${
                  isSelected 
                    ? 'bg-custom-terra/20 text-custom-terra border-2 border-custom-terra/50 font-medium' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-custom-cream/20'
                }`}
              >
                <FaMapMarkerAlt className={`text-lg mr-2 ${isSelected ? 'text-custom-terra' : 'text-gray-400'}`} />
                <span className={`${isSelected ? 'font-medium' : ''}`}>{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default LocationOptionsFilter;