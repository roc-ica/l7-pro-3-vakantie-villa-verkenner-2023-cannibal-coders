import React from 'react';
import { Property, PropertyStatus } from '../../types/property';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaRegHeart, FaHome, FaTag } from 'react-icons/fa';
import { formatPrice, formatDate, formatArea, getStatusColor, formatPropertyType } from '../../utils/formatters';

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const getDefaultStatus = (property: Property): PropertyStatus => {
    return property.status || 'available';
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <Link to={`/property/${property.id}`} key={property.id} className="group block h-[480px]">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
              {/* Image Container with Status Badge */}
              <div className="relative h-52 w-full flex-shrink-0">
                <img 
                  src={property.image_url} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Status Badge - Top Left */}
                <div className="absolute top-4 left-4">
                  <span className={`${getStatusColor(getDefaultStatus(property)).bg} 
                    ${getStatusColor(getDefaultStatus(property)).text} 
                    px-3 py-1 rounded-full text-sm font-semibold shadow-sm
                    flex items-center gap-1`}
                  >
                    <FaTag className="w-3 h-3" />
                    {getDefaultStatus(property).charAt(0).toUpperCase() + getDefaultStatus(property).slice(1)}
                  </span>
                </div>
                {/* Favorite Button - Top Right */}
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <FaRegHeart className="text-gray-700 w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Price and Property Type */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </span>
                  {property.property_type && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaHome className="w-3 h-3" />
                      {formatPropertyType(property.property_type)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                  {property.title}
                </h3>

                {/* Location and more info */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                  <span className="truncate">{property.location}, {property.country}</span>
                </div>

                <p className="text-gray-600 line-clamp-3 mb-3">
                  {property.description}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-auto">
                  <div className="flex items-center">
                    <FaBed className="mr-2 flex-shrink-0" />
                    <span>{property.bedrooms} rooms</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-2 flex-shrink-0" />
                    <span>2 baths</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="mr-2 flex-shrink-0" />
                    <span>{formatArea(120)}</span>
                  </div>
                </div>

                {/* Listed Date & Status */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  Listed {formatDate(property.created_at)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
