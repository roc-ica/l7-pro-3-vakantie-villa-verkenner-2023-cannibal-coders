import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Property } from '../../types/property';
import { propertyService } from '../../api/api';
import { formatPrice } from '../../utils/formatters';
import { generatePropertyPDF } from '../../components/pdf/PropertyPDFGenerator';

// Import components
import PropertyHero from './components/PropertyHero/PropertyHero';
import PropertyFeatures from './components/PropertyFeatures/PropertyFeatures';
import PropertyDetailsTabs from './components/PropertyDetailsTabs/PropertyDetailsTabs';
import PropertyBookingCard from './components/PropertyBookingCard/PropertyBookingCard';
import ImageCarousel from './components/ImageCarousel/ImageCarousel';

// Add LocationOption type
interface LocationOption {
  id: number;
  name: string;
  description?: string;
}

interface PropertyTypeInfo {
  id: string;
  name: string;
  description: string;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [locationOption, setLocationOption] = useState<LocationOption | null>(null);
  const [propertyTypeInfo, setPropertyTypeInfo] = useState<PropertyTypeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Add state for tracking favorites

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No property ID provided');

        const propertyData = await propertyService.getPropertyById(parseInt(id));
        setProperty(propertyData);
        
        // Use the location_option data from the API response
        if (propertyData.location_option) {
          setLocationOption(propertyData.location_option);
        }

        // Set property type information
        const propertyTypeMapping: Record<string, PropertyTypeInfo> = {
          'apartment': {
            id: 'apartment',
            name: 'Apartment',
            description: 'Self-contained housing unit that occupies part of a building'
          },
          'house': {
            id: 'house',
            name: 'House',
            description: 'A building for human habitation, typically for a single family'
          },
          'villa': {
            id: 'villa',
            name: 'Villa',
            description: 'Luxury residence often with gardens and spacious accommodations'
          },
          'cabin': {
            id: 'cabin',
            name: 'Cabin',
            description: 'Small house made of wood, typically in a rural setting'
          },
          'tent': {
            id: 'tent',
            name: 'Tent',
            description: 'Portable shelter made of fabric, ideal for outdoor enthusiasts'
          },
          'loft': {
            id: 'loft',
            name: 'Loft',
            description: 'Large, open space converted for residential use, often with high ceilings'
          }
        };
        
        if (propertyData.property_type && propertyTypeMapping[propertyData.property_type]) {
          setPropertyTypeInfo(propertyTypeMapping[propertyData.property_type]);
        }

        // Check if property is in favorites
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(savedFavorites.includes(parseInt(id)));
        
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Add toggle favorite function
  const handleToggleFavorite = () => {
    if (!id) return;
    
    const propertyId = parseInt(id);
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    let updatedFavorites;
    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = savedFavorites.filter((favId: number) => favId !== propertyId);
    } else {
      // Add to favorites
      updatedFavorites = [...savedFavorites, propertyId];
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleDownloadPDF = async () => {
    if (!property) return;
    
    try {
      setIsGeneratingPDF(true);
      await generatePropertyPDF(property);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here about the error
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-cream">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-custom-cream border-t-custom-terra rounded-full mb-4 mx-auto"
          />
          <p className="text-custom-charcoal">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-cream">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h1 className="text-2xl font-bold text-custom-terra mb-4">Oops!</h1>
          <p className="text-custom-charcoal mb-6">{error || 'Property not found'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-custom-terra text-white rounded-lg hover:bg-custom-sage transition-colors mx-auto"
          >
            Back to Properties
          </motion.button>
        </div>
      </div>
    );
  }
  
  // Format data for components
  const priceValue = typeof property.price === 'number' 
    ? property.price 
    : typeof property.price === 'string' 
      ? parseFloat(String(property.price).replace(/[^0-9.]/g, '') || '0') 
      : 0;
    
  const capacity = property.capacity || (property.bedrooms ? property.bedrooms * 2 : 2);
  const address = property.address || `${property.location}, ${property.country || 'Australia'}`;
  const formattedPrice = formatPrice(priceValue || 0);

  // Normalize property images for the carousel component
  const normalizedImages = property.images && Array.isArray(property.images) 
    ? property.images.map(img => 
        typeof img === 'string' 
          ? { id: 0, image_url: img, image_type: 'primary', description: '' }
          : 'image_url' in img 
            ? { id: 'id' in img ? img.id : 0, image_url: img.image_url, image_type: 'primary', description: '' }
            : img
      )
    : [];

  return (
    <div className="min-h-screen bg-custom-cream">
      {/* Hero Header */}
      <PropertyHero 
        property={property}
        formattedPrice={formattedPrice}
        isGeneratingPDF={isGeneratingPDF}
        onDownloadPDF={handleDownloadPDF}
        locationOption={locationOption}
        propertyTypeInfo={propertyTypeInfo}
      />

      {/* Remove separate favorite button */}
      {/* Keep the main content layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2">
            {/* Property Features */}
            <PropertyFeatures 
              capacity={capacity} 
              bedrooms={property.bedrooms || 0} 
              price={formattedPrice}
              propertyType={propertyTypeInfo?.name}
            />

            {/* Image Gallery */}
            {normalizedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <ImageCarousel images={normalizedImages} />
              </motion.div>
            )}

            {/* Property Details Tabs */}
            <PropertyDetailsTabs 
              property={property} 
              address={address} 
              locationOption={locationOption}
              propertyTypeInfo={propertyTypeInfo}
            />
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <PropertyBookingCard 
              property={property}
              price={formattedPrice}
              isGeneratingPDF={isGeneratingPDF}
              onDownloadPDF={handleDownloadPDF}
              locationOption={locationOption}
              propertyTypeInfo={propertyTypeInfo}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
