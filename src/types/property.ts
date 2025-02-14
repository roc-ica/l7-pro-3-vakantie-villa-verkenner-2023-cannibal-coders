export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  features: string[];
  createdAt: Date;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  minBedrooms?: number;
  type?: string;
}
