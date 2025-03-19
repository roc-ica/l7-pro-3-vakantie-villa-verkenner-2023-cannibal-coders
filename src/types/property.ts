export interface PropertyImage {
  id: number;
  image_url: string;
  image_type: string;
  description: string;
}

export type PropertyStatus = 'available' | 'sold' | 'pending';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'cabin' | 'tent' | 'loft';

// Add LocationOption interface
export interface LocationOption {
  id: number;
  name: string;
  description?: string;
}

export interface Property {
  location_option_id?: number;
  id: number;
  name: string;
  location: string;
  country: string;
  address: string;
  capacity: number;
  price: number;
  description: string;
  amenities?: string;
  created_at: string;
  images: PropertyImage[];
  title: string;
  bedrooms: number;
  bathrooms: number;
  rating?: number;
  image_url: string;
  status: PropertyStatus;
  property_type: PropertyType;
  updated_at?: string;
  location_option?: LocationOption;
}

export interface PropertyFilter {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  country?: string;
  minBedrooms?: number;
  minCapacity?: number;
  bedrooms?: number;
  bathrooms?: number;
  rating?: number;
  capacity?: number;
  amenities?: string[];
  propertyType?: string;
  status?: PropertyStatus;
  locationOptionId?: number;
}

export interface PropertyListProps {
  properties: Property[];
  view: 'grid' | 'map';
}