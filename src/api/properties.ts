import { Property, PropertyImage } from '../types/property';

interface PropertyDetailResponse {
  status: 'success' | 'error';
  property?: Property & {
    images: {
      interior: PropertyImage[];
      exterior: PropertyImage[];
      surroundings: PropertyImage[];
    };
  };
  message?: string;
}

export const fetchPropertyDetail = async (id: number): Promise<PropertyDetailResponse> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/property-detail.php?id=${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch property details');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch property details: ' + (error as Error).message);
  }
};
