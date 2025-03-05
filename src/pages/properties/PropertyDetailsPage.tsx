import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBed, FaUsers, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';
import { Property } from '../../types/property';
import { propertyService } from '../../services/api';
import { amenities } from '../../data/amenities';
import PropertyMap from './components/map/PropertyMap';
import ImageCarousel from './components/ImageCarousel/ImageCarousel';
import { formatPrice } from '../../utils/formatters';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'reviews'>('details');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No property ID provided');

        const propertyData = await propertyService.getPropertyById(parseInt(id));
        setProperty(propertyData);
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

  const getPropertyAmenities = (amenitiesArray?: string[]) => {
    if (!amenitiesArray) return [];
    
    return amenitiesWithIcons.filter(item => 
      amenitiesArray.some(amenity => 
        amenity.toLowerCase().includes(item.id.toLowerCase()) ||
        item.name.toLowerCase().includes(amenity.toLowerCase())
      )
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add logic to save to user's favorites
  };

  const handleGeneratePDF = () => {
    if (property) {
      generatePropertyPDF(property);
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
  
  // Make sure price is a number for formatting
  const priceValue = typeof property.price === 'number' 
    ? property.price 
    : typeof property.price === 'string' 
      ? parseFloat(String(property.price).replace(/[^0-9.]/g, '') || '0') 
      : 0;
    
  // Default values for missing data
  const capacity = property.capacity || (property.bedrooms ? property.bedrooms * 2 : 2);
  const address = property.address || `${property.location}, ${property.country || 'Australia'}`;
  const formattedPrice = formatPrice(priceValue || 0);

  return (
    <div className="min-h-screen bg-custom-cream">
      {/* Hero Header */}
      <div className="relative h-[500px] md:h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={property.image_url || ''}
            alt={property.name || 'Property'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-custom-dark/90 via-custom-dark/40 to-transparent" />
        </div>

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            {/* Back Button */}
            <Link 
              to="/properties"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white transition-colors hover:bg-white/20 mb-8"
            >
              <FaArrowLeft /> Back to Properties
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {property.name || property.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-custom-terra" />
                  <span>{property.location}{property.country ? `, ${property.country}` : ''}</span>
                </div>
                
                <div className="flex items-center">
                  <FaDollarSign className="mr-2 text-custom-terra" />
                  <span className="text-xl font-semibold">{formattedPrice}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2">
            {/* Property Features */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
                <FaUsers className="text-2xl text-custom-terra mb-2" />
                <p className="text-sm text-custom-charcoal">Capacity</p>
                <p className="font-bold text-custom-dark">{capacity} persons</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
                <FaBed className="text-2xl text-custom-terra mb-2" />
                <p className="text-sm text-custom-charcoal">Bedrooms</p>
                <p className="font-bold text-custom-dark">{property.bedrooms}</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
                <FaDollarSign className="text-2xl text-custom-terra mb-2" />
                <p className="text-sm text-custom-charcoal">Price</p>
                <p className="font-bold text-custom-dark">{formattedPrice}</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-custom-cream/30 rounded-lg">
                <FaCalendar className="text-2xl text-custom-terra mb-2" />
                <p className="text-sm text-custom-charcoal">Available</p>
                <p className="font-bold text-custom-dark">Immediately</p>
              </div>
            </motion.div>

            {/* Image Gallery */}
            {property.images && Array.isArray(property.images) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <ImageCarousel 
                  images={property.images.map(img => 
                    typeof img === 'string' 
                      ? { id: 0, image_url: img, image_type: 'primary', description: '' }
                      : 'image_url' in img 
                        ? { id: 0, image_url: img.image_url, image_type: 'primary', description: '' }
                        : img
                  )} 
                />
              </motion.div>
            )}

            {/* Tab Navigation */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex p-2 bg-custom-cream/30">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'location', label: 'Location' },
                  { id: 'reviews', label: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-custom-terra shadow-sm'
                        : 'text-custom-charcoal hover:bg-white/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-custom-dark mb-4">Property Details</h2>
                      <p className="text-custom-charcoal leading-relaxed mb-6">
                        {property.description || 'No description provided for this property.'}
                      </p>

                      <h3 className="text-xl font-semibold text-custom-dark mb-3">Amenities</h3>
                      {property.amenities && property.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {getPropertyAmenities(Array.isArray(property.amenities) ? property.amenities : []).map((item, i) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-custom-cream/20 rounded-lg">
                              <div className="text-custom-terra">
                                <item.icon />
                              </div>
                              <span className="text-custom-dark">{item.name}</span>
                            </div>
                          ))}
                          
                          {/* Additional text amenities */}
                          {Array.isArray(property.amenities) && property.amenities
                            .filter(amenity => 
                              !getPropertyAmenities([amenity]).length
                            )
                            .map((amenity, i) => (
                              <div key={`text-${i}`} className="flex items-center gap-3 p-3 bg-custom-cream/20 rounded-lg">
                                <div className="text-custom-terra">
                                  <FaCheck />
                                </div>
                                <span className="text-custom-dark">{amenity}</span>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <p className="text-custom-charcoal/70 italic">
                          No amenities listed for this property.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-custom-dark mb-4">Location</h2>
                      <p className="text-custom-charcoal mb-6">
                        <strong>Address:</strong> {address}
                      </p>
                      <div className="h-[400px] bg-custom-cream/30 rounded-lg overflow-hidden">
                        <PropertyMap 
                          address={address}
                          location={property.location}
                          country={property.country || 'Australia'}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-64 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-custom-charcoal mb-2">Reviews coming soon</p>
                        <p className="text-custom-charcoal/70 text-sm">Be the first to review this property</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booking Card */}
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

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 bg-custom-terra text-white rounded-lg font-semibold hover:bg-custom-sage transition-colors mb-3 flex items-center justify-center"
                >
                  Book Now
                </motion.button>

                <button 
                  onClick={toggleFavorite}
                  className="w-full py-3 border border-custom-terra text-custom-terra rounded-lg font-medium hover:bg-custom-cream/30 transition-colors flex items-center justify-center gap-2"
                >
                  {isFavorite ? (
                    <>
                      <FaHeart /> Saved to Favorites
                    </>
                  ) : (
                    <>
                      <FaRegHeart /> Save to Favorites
                    </>
                  )}
                </button>
              </div>

              {/* Property Details */}
              <div className="border-t border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-custom-dark">Property Details</h3>
                <ul className="space-y-3 text-custom-charcoal">
                  {[
                    { label: 'Property ID', value: property.id },
                    { label: 'Type', value: 'Villa' },
                    { label: 'Year Built', value: '2020' },
                    { label: 'Last Updated', value: formatDate(property.created_at) }
                  ].map((detail, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-custom-charcoal/70">{detail.label}</span>
                      <span className="font-medium">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
