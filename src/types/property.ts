export interface PropertyImage {
  id: number;
  image_url: string;
  image_type: string;
  description: string;
}

export type PropertyStatus = 'available' | 'sold' | 'pending';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'cabin' | 'tent' | 'loft';

export interface Property {
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
}

export interface PropertyListProps {
  properties: Property[];
  view: 'grid' | 'map';
}