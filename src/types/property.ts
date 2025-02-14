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
  images: string[];
  title: string;
  bedrooms: number;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  minBedrooms?: number;
  type?: string;
}
