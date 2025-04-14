import React from 'react';
import HeroSection from './landing/sections/HeroSection';
import FeaturesSection from './landing/sections/InfoBlocks';
import FeaturedProperties from './landing/sections/FeaturedProperties';
import TestimonialsSection from './landing/sections/TestimonialsSection';
import NewsletterSection from './landing/sections/NewsletterSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-custom-cream">
      {/* Full-width sections */}
      <HeroSection />
      
      {/* Container for consistent spacing and padding */}
      <div className="flex flex-col space-y-0">
        <FeaturesSection />
        <FeaturedProperties />
        <TestimonialsSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default LandingPage;
