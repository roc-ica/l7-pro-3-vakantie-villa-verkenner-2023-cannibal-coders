import React from 'react';
import { Property } from '../../types/property';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{property.name}</h2>
        <p className="text-gray-600 mb-4">{property.location}, {property.country}</p>
        <div className="mb-4">
          <p className="text-gray-700">{property.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            €{property.price.toLocaleString()}
          </div>
          <div className="text-gray-600">
            Capacity: {property.capacity} persons
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
