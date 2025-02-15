import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBed, FaUsers, FaMapMarkerAlt, FaEuroSign, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { Property, PropertyImage } from '../../types/property';
import { propertyService } from '../../services/api';
import { amenities } from '../../data/amenities';
import PropertyMap from './map/PropertyMap';
import { Tab } from '@headlessui/react';
import { formatPrice } from '../../utils/formatters';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const imageCategories = {
    all: property?.images || [],
    interior: property?.images?.filter(img => img.image_type === 'interior') || [],
    exterior: property?.images?.filter(img => img.image_type === 'exterior') || [],
    surroundings: property?.images?.filter(img => img.image_type === 'surroundings') || [],
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getPropertyById(Number(id));
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getPropertyAmenities = (amenitiesString: string | null) => {
    if (!amenitiesString) return [];
    const amenityIds = amenitiesString.split(',').map(id => id.trim());
    return amenities.filter(amenity => amenityIds.includes(amenity.id));
  };

  const getImageUrl = (image: PropertyImage | undefined): string => {
    if (!image) return property?.image_url || '';
    return image.image_url;
  };

  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }

      if (isAutoPlaying && !isPaused && property?.images?.length) {
        autoPlayInterval.current = setInterval(() => {
          setCurrentImageIndex((prev) => {
            const nextIndex = prev + 1;
            const currentImages = imageCategories.all;
            return nextIndex >= currentImages.length ? 0 : nextIndex;
          });
        }, 3000); // Change image every 3 seconds
      }
    };

    startAutoPlay();

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, isPaused, property?.images, imageCategories.all]);

  const handleImageClick = () => {
    setIsPaused(!isPaused);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Property not found</h2>
        <button 
          onClick={() => navigate('/properties')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Return to properties
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Made more impactful */}
      <div className="relative h-[500px]">
        <img 
          src={property.image_url || ''} 
          alt={property.name || 'Property'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <nav className="mb-6">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all"
              >
                <span className="mr-2">←</span>
                Back to listings
              </button>
            </nav>
            <h1 className="text-5xl font-bold text-white mb-4">{property.name}</h1>
            <div className="flex items-center space-x-6 text-white/90">
              <p className="flex items-center text-xl">
                <FaMapMarkerAlt className="mr-2" />
                {property.location}, {property.country}
              </p>
              <p className="flex items-center text-xl">
                  {formatPrice(property.price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats - Moved up for better visibility */}
            <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-4 gap-6">
              {[
                { icon: FaUsers, label: 'Capacity', value: `${property.capacity} persons` },
                { icon: FaBed, label: 'Bedrooms', value: property.bedrooms },
                { icon: FaEuroSign, label: 'Price', value: `${formatPrice(property.price)}` },
                { icon: FaMapMarkerAlt, label: 'Location', value: property.country }
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all">
                  <stat.icon className="mx-auto text-2xl text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Image Gallery - Updated with autoplay controls */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Tab.Group>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Tab.List className="flex space-x-2">
                      {Object.entries(imageCategories).map(([category, images]) => (
                        <Tab
                          key={category}
                          disabled={!images || images.length === 0}
                          className={({ selected }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${selected 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                            ${(!images || images.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`
                          }
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                          {images && images.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                              {images.length}
                            </span>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>
                    
                    <button
                      onClick={toggleAutoPlay}
                      className="flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      {isAutoPlaying ? (
                        <>
                          <FaPause className="mr-2" />
                          Stop Slideshow
                        </>
                      ) : (
                        <>
                          <FaPlay className="mr-2" />
                          Start Slideshow
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <Tab.Panels>
                  {Object.values(imageCategories).map((images, idx) => (
                    <Tab.Panel key={idx} className="focus:outline-none">
                      <div className="relative">
                        <div 
                          className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9 cursor-pointer"
                          onClick={handleImageClick}
                        >
                          {images.length > 0 ? (
                            <>
                              <img
                                src={getImageUrl(images[currentImageIndex])}
                                alt={images[currentImageIndex]?.description || 'Property image'}
                                className="object-cover w-full h-full"
                              />
                              {/* Progress indicator */}
                              <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/50 to-transparent">
                                <div className="flex space-x-2">
                                  {images.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex 
                                          ? 'w-6 bg-white' 
                                          : 'w-1.5 bg-white/50'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {/* Pause indicator */}
                              {isPaused && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <div className="bg-white/90 rounded-full p-4">
                                    <FaPause className="text-2xl text-blue-600" />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <p className="text-gray-500">No images available</p>
                            </div>
                          )}
                        </div>
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentImageIndex((prev) => 
                                prev === 0 ? images.length - 1 : prev - 1
                              )}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                            >
                              <FaChevronLeft className="text-gray-800" />
                            </button>
                            <button
                              onClick={() => setCurrentImageIndex((prev) => 
                                prev === images.length - 1 ? 0 : prev + 1
                              )}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                            >
                              <FaChevronRight className="text-gray-800" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Updated thumbnails with active state */}
                      <div className="grid grid-cols-6 gap-2 p-4">
                        {images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setIsPaused(true);
                            }}
                            className={`
                              relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden
                              transition-all duration-300
                              ${currentImageIndex === index 
                                ? 'ring-2 ring-blue-600 scale-105 z-10' 
                                : 'hover:scale-105'
                              }
                            `}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={image.description || `Property image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>

            {/* Content Tabs - Improved styling */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex p-1 bg-gray-50">
                {['overview', 'amenities', 'location'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all
                      ${activeTab === tab 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-white/50'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Property Description</h2>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                    {property.amenities ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {getPropertyAmenities(property.amenities).map((amenity) => (
                          <div key={amenity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-blue-600 mr-2">
                              <amenity.icon />
                            </span>
                            <span>{amenity.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No amenities listed for this property</p>
                    )}
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Location</h2>
                    <p className="text-gray-700 mb-4">
                      <strong>Address:</strong> {property.address}
                    </p>
                    <div className="h-[400px]">
                      <PropertyMap 
                        address={property.address}
                        location={property.location}
                        country={property.country}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="text-center space-y-6">
                <p className="text-4xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.99]">
                    Contact Agent
                  </button>
                  <button className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-all">
                    Save Property
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Property Details</h3>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      { label: 'Property ID', value: property.id },
                      { label: 'Type', value: 'Villa' },
                      { label: 'Year Built', value: '2020' },
                      { label: 'Last Updated', value: new Date(property.created_at).toLocaleDateString() }
                    ].map((detail, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-500">{detail.label}</span>
                        <span className="font-medium">{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
