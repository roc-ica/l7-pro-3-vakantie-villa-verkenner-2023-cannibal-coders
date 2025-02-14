import axios from 'axios';
import { Property, PropertyFilter } from '../types/property';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const testConnection = () => api.get('/test.php');

export const propertyService = {
  getProperties: async (filters?: PropertyFilter) => {
    const response = await api.get(`/properties`, { params: filters });
    return response.data;
  },

  getPropertyById: async (id: number): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
};

export default api;
