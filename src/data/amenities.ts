import { 
  FaSwimmingPool, 
  FaWifi, 
  FaParking, 
  FaSnowflake, 
  FaTv, 
  FaUtensils,
  FaHotTub,
  FaDumbbell,
  FaShip,
  FaUmbrellaBeach,
  FaCity,
  FaCoffee
} from 'react-icons/fa';
import { 
  MdPets, 
  MdLocalLaundryService, 
  MdSecurity,
  MdTheaters,
  MdStore,
  MdRestaurant
} from 'react-icons/md';
import { IconType } from 'react-icons';

export interface Amenity {
  id: string;
  icon: IconType;
  label: string;
  category: 'basic' | 'luxury' | 'safety' | 'entertainment' | 'location';
}

export const amenities: Amenity[] = [
  // Basic amenities
  { id: 'wifi', icon: FaWifi, label: 'Free WiFi', category: 'basic' },
  { id: 'parking', icon: FaParking, label: 'Free Parking', category: 'basic' },
  { id: 'ac', icon: FaSnowflake, label: 'Air Conditioning', category: 'basic' },
  { id: 'tv', icon: FaTv, label: 'Smart TV', category: 'basic' },
  { id: 'kitchen', icon: FaUtensils, label: 'Full Kitchen', category: 'basic' },
  { id: 'pets', icon: MdPets, label: 'Pet Friendly', category: 'basic' },
  { id: 'laundry', icon: MdLocalLaundryService, label: 'Laundry', category: 'basic' },

  // Luxury amenities
  { id: 'pool', icon: FaSwimmingPool, label: 'Swimming Pool', category: 'luxury' },
  { id: 'hottub', icon: FaHotTub, label: 'Hot Tub', category: 'luxury' },
  { id: 'gym', icon: FaDumbbell, label: 'Fitness Center', category: 'luxury' },
  { id: 'boatdock', icon: FaShip, label: 'Boat Dock', category: 'luxury' },

  // Entertainment
  { id: 'entertainment', icon: MdTheaters, label: 'Entertainment', category: 'entertainment' },
  { id: 'breakfast', icon: MdRestaurant, label: 'Breakfast Included', category: 'basic' },

  // Location features
  { id: 'cityview', icon: FaCity, label: 'City View', category: 'location' },
  { id: 'beachaccess', icon: FaUmbrellaBeach, label: 'Beach Access', category: 'location' },

  // Shopping & Services
  { id: 'store', icon: MdStore, label: 'On-site Store', category: 'basic' },
  { id: 'security', icon: MdSecurity, label: '24/7 Security', category: 'safety' },
  { id: 'cafe', icon: FaCoffee, label: 'Café', category: 'basic' }
];

// Helper function to group amenities by category
export const getAmenitiesByCategory = () => {
  return amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);
};
