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

  // Add featured filter
  if (filters.featured !== undefined) {
    params.append('featured', filters.featured ? '1' : '0');
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

// Updated user service to properly parse the user object from localStorage
export const userService = {
  // Check if user is logged in by looking for a stored user object
  isLoggedIn(): boolean {
    const userJson = localStorage.getItem('user');
    const isLoggedIn = userJson !== null && userJson !== undefined;
    console.log(`[userService] isLoggedIn: ${isLoggedIn}`);
    return isLoggedIn;
  },
  
  // Get current user ID from the user object in localStorage
  getCurrentUserId(): number | null {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.log('[userService] No user found in localStorage');
        return null;
      }
      
      const user = JSON.parse(userJson);
      if (!user || !user.id) {
        console.log('[userService] User object has no ID property');
        return null;
      }
      
      console.log(`[userService] getCurrentUserId returning: ${user.id}`);
      return user.id;
    } catch (error) {
      console.error('[userService] Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  // Set the user object in localStorage
  setCurrentUser(user: any): void {
    console.log('[userService] Setting user:', user);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Get the full user object from localStorage
  getCurrentUser(): any | null {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        return null;
      }
      return JSON.parse(userJson);
    } catch (error) {
      console.error('[userService] Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  logout(): void {
    console.log('[userService] Logging out, removing user');
    localStorage.removeItem('user');
  }
};
