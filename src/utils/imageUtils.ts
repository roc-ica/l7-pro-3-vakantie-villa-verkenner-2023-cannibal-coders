/**
 * Formats image URLs to ensure they work correctly
 * - Handles relative paths from the API
 * - Provides fallback for failed images
 */
export const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/images/placeholder-property.jpg';
  
  // If it's already an absolute URL (starts with http or https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path starting with /uploads, prepend the API base URL
  if (url.startsWith('/uploads')) {
    return `http://localhost:8000${url}`;
  }
  
  // If path starts without a slash but with uploads
  if (url.startsWith('uploads/')) {
    return `http://localhost:8000/${url}`;
  }
  
  // Otherwise, use as is (this could be a public URL or base64 image)
  return url;
};

/**
 * Provides a fallback image if the original fails to load
 */
export const getPlaceholderForType = (type?: string): string => {
  switch(type?.toLowerCase()) {
    case 'property':
    case 'villa':
      return '/images/placeholder-property.jpg';
    case 'interior':
      return '/images/placeholder-interior.jpg';
    case 'exterior':
      return '/images/placeholder-exterior.jpg';
    default:
      return '/images/placeholder-general.jpg';
  }
};
