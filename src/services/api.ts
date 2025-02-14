import { Property, PropertyFilter } from '../types/property';

const API_URL = 'http://localhost:8000/api';

export const propertyService = {
  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    try {
      const response = await fetch(`${API_URL}/properties.php`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  }
};
