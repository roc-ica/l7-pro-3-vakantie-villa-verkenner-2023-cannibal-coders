import { Property, PropertyFilter } from '../types/property';

const API_URL = 'http://localhost:8000/api'; // Updated to match server structure

const buildQueryString = (filters: PropertyFilter): string => {
  const params = new URLSearchParams();

  if (filters.searchTerm) params.append('search', filters.searchTerm);
  if (filters.location) params.append('location', filters.location);
  if (filters.country) params.append('country', filters.country);
  if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
  if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
  if (filters.minBedrooms) params.append('min_bedrooms', filters.minBedrooms.toString());
  if (filters.minCapacity) params.append('min_capacity', filters.minCapacity.toString());
  if (filters.amenities?.length) params.append('amenities', filters.amenities.join(','));

  // Add property type filter
  if (filters.propertyType) {
    params.append('property_type', filters.propertyType);
  }

  // Add country filter (exact match)
  if (filters.country) {
    params.append('country_exact', filters.country);
  }

  // Log the query string for debugging
  console.log('Query params:', params.toString());

  return params.toString();
};

export const propertyService = {
  async getProperties(filters: PropertyFilter = {}): Promise<Property[]> {
    try {
      const queryString = buildQueryString(filters);
      const url = `${API_URL}/properties.php${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch properties');
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return data.properties || [];
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getPropertyById(id: number): Promise<Property> {
    try {
      const response = await fetch(`${API_URL}/property.php?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      if (!data.property) {
        throw new Error('Property data is missing');
      }

      // Return the property data directly
      return data.property;
      
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }
};

export const heroService = {
  getHeroData: async () => {
    try {
      const response = await fetch(`${API_URL}/hero-images.php`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // Fallback data in case of error
      return {
        heroImages: [
          { url: '/default-hero.jpg', location: 'Australia' }
        ],
        popularLocations: ['Sydney', 'Melbourne', 'Brisbane']
      };
    }
  }
};
