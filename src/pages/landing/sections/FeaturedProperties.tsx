import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaBed, FaBath, FaHeart, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatImageUrl, getPlaceholderForType } from '../../../utils/imageUtils';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  images: string[];
  tags: string[];
  description: string;
  amenities: string[];
  rating: number;
  bedrooms: number;
  bathrooms: number;
}

const PropertyCard: React.FC<{ property: Property; index: number }> = ({ property, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/property/${property.id}`} className="block group">
        <motion.div 
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -8 }}
        >
          {/* Image Carousel */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <AnimatePresence mode='wait'>
              <motion.img 
                key={currentImageIndex}
                src={formatImageUrl(property.images[currentImageIndex])}
                alt={`${property.title} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  // Set fallback image if loading fails
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('placeholder')) {
                    target.src = getPlaceholderForType('property');
                    
                    // Prevent infinite loading attempts by marking this image as already failed
                    target.onerror = null;
                  }
                }}
              />
            </AnimatePresence>

            {/* Image Navigation */}
            {isHovered && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{property.images.length}
            </div>

            {/* Tags */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {property.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-custom-sage/90 text-white text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Favorite Button with Animation */}
            <motion.button 
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
              whileTap={{ scale: 0.9 }}
            >
              <FaHeart className="text-custom-terra/50 group-hover:text-custom-terra transition-colors duration-300" />
            </motion.button>
          </div>

          {/* Content with Hover Effects */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl text-custom-dark group-hover:text-custom-terra transition-colors duration-300">
                {property.title}
              </h3>
              <div className="flex items-center bg-custom-cream px-2 py-1 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 text-custom-charcoal font-medium">{property.rating}</span>
              </div>
            </div>

            {/* Description with truncate */}
            <p className="text-custom-charcoal mb-4 line-clamp-2">
              {property.description}
            </p>

            <div className="flex items-center text-custom-charcoal mb-4">
              <FaMapMarkerAlt className="text-custom-terra mr-2" />
              <span>{property.location}</span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <FaBed className="mr-2 text-custom-sage" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <FaBath className="mr-2 text-custom-sage" />
                <span>{property.bathrooms} Baths</span>
              </div>
              {property.amenities.slice(0, 2).map((amenity, i) => (
                <span key={i} className="text-custom-charcoal">• {amenity}</span>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="flex justify-between items-center pt-4 border-t border-custom-cream">
              <div>
                <span className="text-2xl font-bold text-custom-terra">{property.price}</span>
                <span className="text-custom-charcoal">/night</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-custom-sage text-white rounded-lg hover:bg-custom-terra transition-colors duration-300"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const FeaturedProperties: React.FC = () => {
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const properties: Property[] = [
    {
      id: 1,
      title: "Coastal Paradise Villa",
      location: "Gold Coast, Queensland",
      price: "$850/night",
      images: [
        "https://source.unsplash.com/800x600/?luxury,villa",
        "https://source.unsplash.com/800x600/?beach,house"
      ],
      tags: ["Beachfront", "Luxury"],
      description: "Stunning beachfront villa with panoramic ocean views",
      amenities: ["Pool", "Spa", "Tennis Court"],
      rating: 4.9,
      bedrooms: 4,
      bathrooms: 3
    },
    {
      id: 2,
      title: "Mountain Chalet Retreat",
      location: "Blue Mountains, New South Wales",
      price: "$550/night",
      images: [
        "https://source.unsplash.com/800x600/?mountain,chalet",
        "https://source.unsplash.com/800x600/?cabin,woods"
      ],
      tags: ["Secluded", "Mountain Views"],
      description: "Escape to the mountains in this cozy chalet",
      amenities: ["Fireplace", "Hot Tub", "Sauna"],
      rating: 4.7,
      bedrooms: 2,
      bathrooms: 2
    },
    {
      id: 3,
      title: "City Skyline Penthouse",
      location: "Sydney, New South Wales",
      price: "$1200/night",
      images: [
        "https://source.unsplash.com/800x600/?city,penthouse",
        "https://source.unsplash.com/800x600/?apartment,view"
      ],
      tags: ["Luxury", "City Views", "Penthouse", "Skyline"], 
      description: "Luxurious penthouse with breathtaking city views",
      amenities: ["Rooftop Pool", "Gym", "Concierge"],
      rating: 5.0,
      bedrooms: 3,
      bathrooms: 3
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-custom-dark mb-4">
          Featured Properties
        </h2>
        <p className="text-xl text-custom-charcoal max-w-2xl mx-auto mb-8">
          Discover our hand-picked luxury properties across Australia
        </p>

        {/* Price Filter */}
        <div className="relative inline-block">
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-custom-cream rounded-lg hover:bg-custom-terra hover:text-white transition-all duration-300"
          >
            <FaFilter />
            <span>Filter by Price</span>
          </motion.button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl z-10 py-2"
              >
                {['all', 'under-500', '500-1000', 'over-1000'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setPriceFilter(filter);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-custom-cream transition-colors
                              ${priceFilter === filter ? 'text-custom-terra font-medium' : 'text-custom-charcoal'}`}
                  >
                    {filter === 'all' ? 'All Prices' : 
                     filter === 'under-500' ? 'Under $500' :
                     filter === '50-1000' ? '$500 - $1000' : 'Over $1000'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Grid with Filtered Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {properties
          .filter(property => {
            if (priceFilter === 'all') return true;
            const price = parseInt(property.price.replace(/\D/g, ''));
            return (
              (priceFilter === 'under-500' && price < 500) ||
              (priceFilter === '500-1000' && price >= 500 && price <= 1000) ||
              (priceFilter === 'over-1000' && price > 1000)
            );
          })
          .map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
      </div>

      {/* View All Button */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link 
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 bg-custom-terra text-white rounded-lg
                   hover:bg-custom-sage transition-colors duration-300 font-semibold"
        >
          View All Properties
          <FaChevronRight />
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedProperties;
