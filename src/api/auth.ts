import axios from 'axios';
import { UserCredentials } from '../types/user';
import { userService } from './api';

// Make sure this matches the API_URL in api.ts
const API_URL = 'http://localhost:8000/api';

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
      const userId = userService.getCurrentUserId();
      
      console.log(`[getFavorites] Getting favorites for user ID: ${userId}`);
      
      if (!userId) {
        console.log('[getFavorites] No user ID found, returning empty favorites');
        return { favorites: [] };
      }

      console.log(`[getFavorites] Fetching from ${API_URL}/favorites.php?user_id=${userId}`);
      
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`);
      const data = await response.json();
      
      console.log('[getFavorites] Response:', data);
      
      return data;
    } catch (error) {
      console.error('[getFavorites] Error:', error);
      return { status: 'error', favorites: [] };
    }
  },

  // Add a property to favorites
  addToFavorites: async (propertyId: number) => {
    try {
      const userId = userService.getCurrentUserId();
      
      console.log(`[addToFavorites] Adding property ${propertyId} for user ID: ${userId}`);
      
      if (!userId) {
        console.log('[addToFavorites] No user ID found, cannot add favorite');
        return { status: 'error', message: 'Authentication required' };
      }

      console.log(`[addToFavorites] Sending POST to ${API_URL}/favorites.php`);
      console.log('[addToFavorites] Request payload:', { property_id: propertyId, user_id: userId });
      
      const response = await fetch(`${API_URL}/favorites.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          user_id: userId
        })
      });
      
      const data = await response.json();
      console.log('[addToFavorites] Response:', data);
      
      return data;
    } catch (error) {
      console.error('[addToFavorites] Error:', error);
      return { status: 'error', message: 'Failed to add to favorites' };
    }
  },

  // Remove a property from favorites
  removeFromFavorites: async (propertyId: number) => {
    try {
      const userId = userService.getCurrentUserId();
      
      console.log(`[removeFromFavorites] Removing property ${propertyId} for user ID: ${userId}`);
      
      if (!userId) {
        console.log('[removeFromFavorites] No user ID found, cannot remove favorite');
        return { status: 'error', message: 'Authentication required' };
      }

      console.log(`[removeFromFavorites] Sending DELETE to ${API_URL}/favorites.php`);
      console.log('[removeFromFavorites] Request payload:', { property_id: propertyId, user_id: userId });
      
      const response = await fetch(`${API_URL}/favorites.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          user_id: userId
        })
      });
      
      const data = await response.json();
      console.log('[removeFromFavorites] Response:', data);
      
      return data;
    } catch (error) {
      console.error('[removeFromFavorites] Error:', error);
      return { status: 'error', message: 'Failed to remove from favorites' };
    }
  },

  // Check if a property is in favorites
  isPropertyInFavorites: async (propertyId: number) => {
    try {
      const userId = userService.getCurrentUserId();
      
      console.log(`[isPropertyInFavorites] Checking property ${propertyId} for user ID: ${userId}`);
      
      if (!userId) {
        console.log('[isPropertyInFavorites] No user ID found, cannot check favorites');
        return false;
      }
      
      console.log(`[isPropertyInFavorites] Fetching from ${API_URL}/favorites.php?user_id=${userId}`);
      
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`);
      const data = await response.json();
      
      console.log('[isPropertyInFavorites] Response:', data);
      
      if (!data.favorites || !Array.isArray(data.favorites)) {
        console.log('[isPropertyInFavorites] No favorites found in response');
        return false;
      }
      
      const isFavorite = data.favorites.some((fav: any) => {
        // Check both the id and property_id fields
        const favId = fav.id || fav.property_id;
        return Number(favId) === Number(propertyId);
      });
      
      console.log(`[isPropertyInFavorites] Property ${propertyId} is ${isFavorite ? '' : 'not '}in favorites`);
      
      return isFavorite;
    } catch (error) {
      console.error('[isPropertyInFavorites] Error:', error);
      return false;
    }
  }
};

export default authService;
