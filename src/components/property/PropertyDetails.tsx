import React from 'react';
import { Property } from '../../types/property';
import { formatPrice } from '../../utils/formatters';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            <p className="text-2xl text-blue-600 font-bold mb-4">
              {formatPrice(property.price)}
            </p>
            <p className="text-gray-600 mb-4">{property.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Location</p>
                <p>{property.location}</p>
              </div>
              <div>
                <p className="font-semibold">Bedrooms</p>
                <p>{property.bedrooms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
