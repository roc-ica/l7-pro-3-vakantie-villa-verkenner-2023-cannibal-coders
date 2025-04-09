import axios from 'axios';
import { UserCredentials } from '../types/user';
import { userService } from './api';

const API_URL = 'http://localhost/api';

// Define extended interface to include username if needed
interface UserRegistrationData extends UserCredentials {
  username?: string;
}

export const authService = {
  login: async (credentials: UserCredentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  register: async (userData: UserRegistrationData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  }
};

export const favoritesService = {
  // Get all favorites for the current user
  getFavorites: async () => {
    try {
      // Simple localStorage key for all favorites
      const storageKey = 'favorites';
      
      // Get favorites from localStorage
      const localFavorites = localStorage.getItem(storageKey);
      if (localFavorites) {
        console.log('Retrieved favorites:', JSON.parse(localFavorites));
        return { favorites: JSON.parse(localFavorites) };
      }
      
      // Initialize empty favorites if not found
      localStorage.setItem(storageKey, JSON.stringify([]));
      return { favorites: [] };
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { favorites: [] };
    }
  },

  // Add a property to favorites
  addToFavorites: async (propertyId: number) => {
    try {
      const storageKey = 'favorites';
      
      // Get current favorites
      const localFavorites = localStorage.getItem(storageKey);
      const favorites = localFavorites ? JSON.parse(localFavorites) : [];
      
      // Check if property is already in favorites
      if (!favorites.some((fav: any) => fav.id === propertyId)) {
        // Add the new property
        favorites.push({ id: propertyId });
        localStorage.setItem(storageKey, JSON.stringify(favorites));
        console.log(`Added property ${propertyId} to favorites. New favorites:`, favorites);
      }
      
      return { status: 'success', message: 'Property added to favorites' };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { status: 'error', message: 'Failed to add to favorites' };
    }
  },

  // Remove a property from favorites
  removeFromFavorites: async (propertyId: number) => {
    try {
      const storageKey = 'favorites';
      
      // Get current favorites
      const localFavorites = localStorage.getItem(storageKey);
      let favorites = localFavorites ? JSON.parse(localFavorites) : [];
      
      // Remove the property
      favorites = favorites.filter((fav: any) => fav.id !== propertyId);
      localStorage.setItem(storageKey, JSON.stringify(favorites));
      console.log(`Removed property ${propertyId} from favorites. New favorites:`, favorites);
      
      return { status: 'success', message: 'Property removed from favorites' };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { status: 'error', message: 'Failed to remove from favorites' };
    }
  },

  // Check if a property is in favorites
  isPropertyInFavorites: async (propertyId: number) => {
    try {
      const storageKey = 'favorites';
      
      // Check if property exists in favorites
      const localFavorites = localStorage.getItem(storageKey);
      const favorites = localFavorites ? JSON.parse(localFavorites) : [];
      const isInFavorites = favorites.some((fav: any) => fav.id === propertyId);
      
      console.log(`Property ${propertyId} is ${isInFavorites ? '' : 'not '}in favorites`);
      return isInFavorites;
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  }
};

export default authService;
