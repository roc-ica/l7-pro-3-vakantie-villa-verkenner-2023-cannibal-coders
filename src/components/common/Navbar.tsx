import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Vakantie Vila</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/properties" 
              className="relative text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all hover:after:w-full"
            >
              Properties
            </Link>
            <Link 
              to="/search" 
              className="relative text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all hover:after:w-full"
            >
              Search
            </Link>
            <Link 
              to="/login" 
              className="relative text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all hover:after:w-full"
            >
              Login
            </Link>
            <Link               
              to="/register"               
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
