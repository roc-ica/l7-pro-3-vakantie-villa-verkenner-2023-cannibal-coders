import React, { useState } from 'react';
import { formatImageUrl, getPlaceholderForType } from '../../utils/imageUtils';

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ src, alt, className = '', type = 'property' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
        </div>
      )}
      
      <img 
        src={hasError ? getPlaceholderForType(type) : formatImageUrl(src)}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
};

export default PropertyImage;
