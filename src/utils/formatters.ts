import { PropertyStatus, PropertyType } from '../types/property';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatArea = (meters: number): string => {
  return `${meters} m²`;
};

export const getStatusColor = (status: PropertyStatus): { bg: string; text: string } => {
  switch (status) {
    case 'available':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'sold':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
};

export const formatPropertyType = (type: PropertyType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
