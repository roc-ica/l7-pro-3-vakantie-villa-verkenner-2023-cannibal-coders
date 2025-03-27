import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import PropertyList from '../../../components/property/PropertyList';
import { propertyService } from '../../../api/api';
import { Property } from '../../../types/property';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getProperties({ featured: true });
        
        // Limit to 6 properties for the landing page
        const limitedProperties = data.slice(0, 6);
        setProperties(limitedProperties);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // If there are no featured properties and we're not loading, don't render the section
  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-custom-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <FaStar className="text-yellow-400 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-custom-dark">
              Featured Properties
            </h2>
          </div>
          <p className="text-lg text-custom-charcoal max-w-3xl mx-auto">
            Discover our hand-picked selection of exceptional properties, each chosen for their 
            unique charm, stunning locations, and exceptional amenities.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" color="custom-terra" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-custom-charcoal">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mb-8">
            <PropertyList properties={properties} view="grid" />
          </div>
        )}

        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/properties" className="inline-flex items-center text-custom-terra hover:text-custom-sage transition-colors font-medium">
            View all properties <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
