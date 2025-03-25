import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUserCircle, FaHeart, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Link to={to} className="block group">
      <motion.div 
        className="relative bg-gradient-to-br from-white to-custom-cream p-8 rounded-xl 
                   shadow-lg hover:shadow-2xl transition-all duration-500 
                   border border-custom-gray/20 overflow-hidden"
        whileHover={{ y: -8 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-custom-terra/5 to-custom-sage/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col items-center text-center z-10">
          {/* Icon container with animation */}
          <motion.div 
            className="text-4xl text-custom-terra mb-6 p-4 bg-custom-cream rounded-full
                     group-hover:bg-custom-terra/10 transition-all duration-300"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>

          <h2 className="text-2xl font-bold mb-4 text-custom-dark group-hover:text-custom-terra
                       transition-colors duration-300">
            {title}
          </h2>
          
          <p className="text-custom-charcoal leading-relaxed mb-6">
            {description}
          </p>

          {/* Call to action */}
          <div className="flex items-center justify-center space-x-2 text-custom-terra
                        opacity-0 group-hover:opacity-100 transform translate-y-2
                        group-hover:translate-y-0 transition-all duration-300">
            <span className="font-medium">Learn More</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10
                      bg-gradient-to-br from-custom-sage/20 to-custom-terra/20 rounded-full
                      group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
      </motion.div>
    </Link>
  </motion.div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <FaHome />,
      title: "Luxury Villas",
      description: "Explore our handpicked collection of stunning luxury villas across Australia's most beautiful locations.",
      to: "/properties",
      delay: 0.2
    },
    {
      icon: <FaSearch />,
      title: "Smart Search",
      description: "Find your perfect vacation home with our intelligent search system featuring advanced filters.",
      to: "/search",
      delay: 0.4
    },
    {
      icon: <FaHeart />,
      title: "Save Favorites",
      description: "Create your personalized collection of dream villas and get notified about special offers.",
      to: "/favorites",
      delay: 0.6
    },
    {
      icon: <FaUserCircle />,
      title: "Member Benefits",
      description: "Join our community to unlock exclusive deals and personalized recommendations.",
      to: "/login",
      delay: 0.8
    }
  ];

  return (
    <div className="bg-gradient-to-b from-custom-sage/10 to-custom-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-custom-dark mb-4">
            Experience Australian Luxury
          </h2>
          <p className="text-xl text-custom-charcoal max-w-2xl mx-auto">
            From coastal retreats to outback escapes, discover your perfect Australian getaway
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
