import { Property, PropertyFilter } from '../types/property';

const API_URL = 'http://localhost:8000/api'; // Should match your Docker setup

const buildQueryString = (filters: PropertyFilter): string => {
  const params = new URLSearchParams();

  if (filters.searchTerm) params.append('search', filters.searchTerm);
  if (filters.location) params.append('location', filters.location);
  if (filters.country) params.append('country', filters.country);
  if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
  if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
  if (filters.minBedrooms) params.append('min_bedrooms', filters.minBedrooms.toString());
  if (filters.minCapacity) params.append('min_capacity', filters.minCapacity.toString());
  
  // Add amenities filter
  if (filters.amenities?.length) {
    params.append('amenities', filters.amenities.join(','));
  }

  // Add property type filter
  if (filters.propertyType) {
    params.append('property_type', filters.propertyType);
  }

  // Add location option ID filter
  if (filters.locationOptionId) {
    params.append('location_option_id', filters.locationOptionId.toString());
  }

  // Add bedrooms filter (convert to min_bedrooms format)
  if (filters.bedrooms) {
    params.append('min_bedrooms', filters.bedrooms.toString());
  }

  // Add capacity filter (convert to min_capacity format)
  if (filters.capacity) {
    params.append('min_capacity', filters.capacity.toString());
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
      
      const response = await fetch(url);
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
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch property');
      }
      
      return data.property;
      
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },
  
  async createProperty(formData: FormData): Promise<Property> {
    try {
      console.log("Submitting form data...");
      
      // For debugging: log form data contents
      formData.forEach((value, key) => {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      });

      const response = await fetch(`${API_URL}/properties/create.php`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type - browser will set it with the correct boundary
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to create property');
      }
      
      return data.property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },
  
  async updateProperty(id: number, formData: FormData): Promise<Property> {
    try {
      console.log(`Updating property ${id}...`);
      
      // Create a new FormData object to ensure proper data is sent
      const processedFormData = new FormData();
      
      // Process form data with special handling for location_option_id
      formData.forEach((value, key) => {
        if (key === 'location_option_id') {
          console.log(`Processing ${key}: "${value}" (${typeof value})`);
          
          // If empty value, send a signal that PHP will understand as NULL
          if (value === '' || value === 'null' || value === 'undefined') {
            // Use an explicit PHP representation that will be interpreted as NULL
            processedFormData.append(key, '');
            console.log(`${key} will be sent as empty string (to be NULL in PHP)`);
          } else {
            // Otherwise send the value
            processedFormData.append(key, value);
            console.log(`${key} will be sent as: ${value}`);
          }
        } else {
          // For all other fields, just pass through the value
          processedFormData.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/properties/update.php?id=${id}`, {
        method: 'POST',
        body: processedFormData,
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to update property');
      }
      
      return data.property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },
  
  async deleteProperty(id: number): Promise<void> {
    try {
      console.log(`Deleting property ${id}...`);
      
      const response = await fetch(`${API_URL}/properties/delete.php?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to delete property');
      }

      return;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};

// Add a function to get location options
export const locationOptionsService = {
  async getLocationOptions(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/location-options.php`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch location options');
      }

      return data.locationOptions || [];
      
    } catch (error) {
      console.error('API Error:', error);
      // Return some default options as fallback
      return [
        { id: 1, name: 'Beach Front', description: 'Properties located directly on the beach' },
        { id: 2, name: 'Mountain View', description: 'Properties with views of mountains' },
        { id: 3, name: 'City Center', description: 'Properties located in city centers' },
        { id: 4, name: 'Countryside', description: 'Properties in rural areas' },
        { id: 5, name: 'Lakeside', description: 'Properties by lakes' },
        { id: 6, name: 'Ski-in/Ski-out', description: 'Properties with direct access to ski slopes' }
      ];
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

// Update user service with proper login checks
export const userService = {
  // Check if user is logged in (returns true only if a user ID exists)
  isLoggedIn(): boolean {
    const userId = localStorage.getItem('current_user_id');
    return userId !== null && userId !== undefined;
  },
  
  // Get current user ID (returns null if not logged in)
  getCurrentUserId(): number | null {
    // For now, let's use localStorage to simulate different users
    const userId = localStorage.getItem('current_user_id');
    if (!userId) {
      // Return null instead of defaulting to user ID 2
      return null;
    }
    return parseInt(userId);
  },
  
  setCurrentUserId(userId: number): void {
    localStorage.setItem('current_user_id', userId.toString());
  },
  
  logout(): void {
    localStorage.removeItem('current_user_id');
  }
};

export const favoritesService = {
  async getFavorites(): Promise<Property[]> {
    try {
      console.log('Fetching favorites...');
      const userId = userService.getCurrentUserId();
      
      // Return empty array if not logged in
      if (!userId) {
        console.log('No user logged in, returning empty favorites');
        return [];
      }
      
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`);
      const data = await response.json();
      
      console.log('Favorites API response:', data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch favorites');
      }
      
      console.log('Favorites fetched:', data.favorites?.length || 0, 'items');
      return data.favorites || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },
  
  async addToFavorites(propertyId: number): Promise<void> {
    // Check if user is logged in first
    const userId = userService.getCurrentUserId();
    if (!userId) {
      throw new Error('You must be logged in to save properties to your favorites');
    }
    
    if (!propertyId || isNaN(propertyId)) {
      console.error('Invalid property ID:', propertyId);
      throw new Error('Invalid property ID');
    }
    
    try {
      console.log(`Adding property ${propertyId} to favorites`);
      
      const body = JSON.stringify({ 
        property_id: propertyId,
        user_id: userId
      });
      console.log('Request body:', body);
      
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      
      const data = await response.json();
      console.log('Server response for add to favorites:', data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to add to favorites');
      }
      
      console.log(`Successfully added property ${propertyId} to favorites`);
      return;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },
  
  async removeFromFavorites(propertyId: number): Promise<void> {
    // Check if user is logged in first
    const userId = userService.getCurrentUserId();
    if (!userId) {
      throw new Error('You must be logged in to remove properties from your favorites');
    }
    
    if (!propertyId || isNaN(propertyId)) {
      console.error('Invalid property ID:', propertyId);
      throw new Error('Invalid property ID');
    }
    
    try {
      console.log(`Removing property ${propertyId} from favorites`);
      
      const body = JSON.stringify({ 
        property_id: propertyId,
        user_id: userId
      });
      console.log('Request body:', body);
      
      const response = await fetch(`${API_URL}/favorites.php?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      
      const data = await response.json();
      console.log('Server response for remove from favorites:', data);
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to remove from favorites');
      }
      
      console.log(`Successfully removed property ${propertyId} from favorites`);
      return;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },
  
  async isPropertyFavorited(propertyId: number): Promise<boolean> {
    if (!propertyId || isNaN(propertyId)) {
      console.error('Invalid property ID in isPropertyFavorited:', propertyId);
      return false;
    }
    
    try {
      console.log(`Checking if property ${propertyId} is favorited`);
      const favorites = await this.getFavorites();
      const isFavorited = favorites.some(property => property.id === propertyId);
      console.log(`Property ${propertyId} favorited status:`, isFavorited);
      return isFavorited;
    } catch (error) {
      console.error('Error checking if property is favorited:', error);
      return false;
    }
  }
};
