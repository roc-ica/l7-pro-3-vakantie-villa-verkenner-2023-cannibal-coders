import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaUserCircle, FaShieldAlt } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  role: string;
  location: string;
  rating: number;
  image?: string;
  propertyName?: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "We had an amazing stay at the coastal villa. The panoramic ocean views took our breath away every morning. The property was immaculate, with every detail carefully considered for guest comfort. The private beach access was a highlight for our family!",
      role: "Family Traveler",
      location: "Melbourne, Australia",
      rating: 5,
      image: "https://source.unsplash.com/400x400/?woman,portrait",
      propertyName: "Coastal Paradise Villa"
    },
    {
      id: 2,
      name: "Michael Smith",
      text: "Perfect location and excellent service. The mountain chalet provided the perfect setting for our corporate retreat. The modern amenities alongside the natural beauty created an inspiring environment for our team. Will definitely return!",
      role: "Business Traveler",
      location: "Sydney, Australia",
      rating: 4.5,
      image: "https://source.unsplash.com/400x400/?man,portrait",
      propertyName: "Mountain Chalet Retreat"
    },
    {
      id: 3,
      name: "Emily and David Wong",
      text: "Our honeymoon at the City Skyline Penthouse was nothing short of magical. The sunset views over Sydney Harbor were unforgettable, and the attention to detail throughout the apartment made us feel like royalty. Absolutely worth every penny!",
      role: "Couple",
      location: "Brisbane, Australia",
      rating: 5,
      image: "https://source.unsplash.com/400x400/?couple,portrait",
      propertyName: "City Skyline Penthouse"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Generate star ratings
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < Math.floor(rating) ? "text-yellow-400" : 
                  i === Math.floor(rating) && rating % 1 > 0 ? "text-yellow-400 opacity-50" : 
                  "text-custom-gray/30"}
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left side - Info */}
        <div className="w-full lg:w-2/5">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-custom-dark mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-custom-charcoal">
              Read authentic experiences from travelers who've stayed in our luxury properties
            </p>
          </motion.div>

          {/* Stats and trust indicators */}
          <div className="space-y-6">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-custom-cream rounded-full text-custom-terra text-xl">
                  <FaUserCircle />
                </div>
                <div>
                  <div className="text-2xl font-bold text-custom-dark">10,000+</div>
                  <div className="text-custom-charcoal">Happy travelers</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-custom-cream rounded-full text-custom-terra text-xl">
                  <FaShieldAlt />
                </div>
                <div>
                  <div className="text-2xl font-bold text-custom-dark">100%</div>
                  <div className="text-custom-charcoal">Satisfaction guarantee</div>
                </div>
              </div>
            </motion.div>

            {/* Trust Badges Section */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['5-Star Service', 'Verified Properties', 'Best Price'].map((badge, i) => (
                <div key={i} className="px-4 py-2 bg-custom-cream rounded-full text-sm text-custom-charcoal font-medium">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Testimonial Carousel */}
        <div className="w-full lg:w-3/5 relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10">
            <motion.button
              onClick={prevTestimonial}
              className="bg-white p-3 rounded-full shadow-lg text-custom-terra hover:bg-custom-cream transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft />
            </motion.button>
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
            <motion.button
              onClick={nextTestimonial}
              className="bg-white p-3 rounded-full shadow-lg text-custom-terra hover:bg-custom-cream transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight />
            </motion.button>
          </div>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ 
                  opacity: 0, 
                  x: direction > 0 ? 100 : -100 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction > 0 ? -100 : 100 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-r from-custom-sage to-custom-terra">
                    {testimonials[activeIndex].image ? (
                      <img 
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 text-white">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(testimonials[activeIndex].rating)}
                      </div>
                      {testimonials[activeIndex].propertyName && (
                        <div className="text-sm font-medium">
                          Stayed at: {testimonials[activeIndex].propertyName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <FaQuoteLeft className="text-3xl text-custom-terra/20 mb-4" />
                    
                    <p className="text-custom-charcoal text-lg leading-relaxed mb-8 italic">
                      "{testimonials[activeIndex].text}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-custom-dark">{testimonials[activeIndex].name}</h3>
                        <div className="flex items-center text-custom-charcoal">
                          <span className="mr-2">{testimonials[activeIndex].role}</span>
                          <span>•</span>
                          <span className="ml-2">{testimonials[activeIndex].location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dot Navigation */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === activeIndex 
                    ? 'bg-custom-terra scale-110' 
                    : 'bg-custom-gray/30 hover:bg-custom-terra/50'
                } transition-all duration-300`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
