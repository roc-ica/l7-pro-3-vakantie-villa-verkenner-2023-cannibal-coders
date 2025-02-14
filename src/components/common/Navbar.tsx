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
          <div className="flex items-center space-x-4">
            <Link to="/properties" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              Properties
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              Search
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
