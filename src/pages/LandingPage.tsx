import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-16 pb-20">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
            Find Your Perfect Vacation Villa
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Discover amazing properties for your next holiday
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Link to="/properties" className="transform hover:scale-105 transition-transform">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Browse Properties</h2>
                <p className="text-gray-600">Explore our collection of luxury villas</p>
              </div>
            </Link>
            
            <Link to="/search" className="transform hover:scale-105 transition-transform">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Search</h2>
                <p className="text-gray-600">Find the perfect villa for your needs</p>
              </div>
            </Link>
            
            <Link to="/login" className="transform hover:scale-105 transition-transform">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Member Area</h2>
                <p className="text-gray-600">Login or register to manage bookings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
