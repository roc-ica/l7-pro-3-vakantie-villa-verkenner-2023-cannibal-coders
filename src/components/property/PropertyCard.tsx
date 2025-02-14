import React from 'react';
import { Property } from '../../types/property';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-blue-600 font-bold mt-2">€{property.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
