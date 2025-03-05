import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/search', label: 'Search' },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <motion.h1 
              className={`text-2xl font-bold ${isScrolled ? 'text-custom-dark' : 'text-white'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Vakantie Villa
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  isActiveLink(link.path) 
                    ? `${isScrolled ? 'text-custom-terra' : 'text-custom-terra'} font-medium` 
                    : `${isScrolled ? 'text-custom-dark hover:text-custom-terra' : 'text-white hover:text-custom-cream'}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <motion.button 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                    isScrolled 
                      ? 'bg-custom-cream text-custom-dark' 
                      : 'bg-white/20 backdrop-blur-sm text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="w-8 h-8 bg-custom-terra text-white rounded-full flex items-center justify-center">
                    {user.username?.[0].toUpperCase() || <FaUser />}
                  </span>
                  <span>{user.username}</span>
                  {isAdmin() && (
                    <span className="ml-1 bg-custom-terra text-white text-xs px-1.5 py-0.5 rounded-full">Admin</span>
                  )}
                </motion.button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100">
                  <div className="p-2">
                    <Link to="/account" className="flex items-center px-4 py-2 text-custom-dark hover:bg-custom-cream rounded-md">
                      <FaUser className="mr-2 text-custom-terra" />
                      My Account
                    </Link>
                    <Link to="/favorites" className="flex items-center px-4 py-2 text-custom-dark hover:bg-custom-cream rounded-md">
                      <FaHeart className="mr-2 text-custom-terra" />
                      Favorites
                    </Link>
                    
                    {/* Admin Dashboard Link - Only shown for admins */}
                    {isAdmin() && (
                      <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-custom-dark hover:bg-custom-cream rounded-md">
                        <FaShieldAlt className="mr-2 text-custom-terra" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <hr className="my-2 border-custom-cream" />
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-custom-dark hover:bg-custom-cream rounded-md"
                    >
                      <FaSignOutAlt className="mr-2 text-custom-terra" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isScrolled 
                      ? 'text-custom-dark hover:text-custom-terra' 
                      : 'text-white hover:text-custom-cream'
                  }`}
                >
                  Login
                </Link>
                <Link               
                  to="/register"               
                  className="px-4 py-2 rounded-md bg-custom-terra text-white hover:bg-custom-sage transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? 'text-custom-dark' : 'text-white'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`block px-3 py-2 rounded-md ${
                    isActiveLink(link.path) 
                      ? 'bg-custom-cream text-custom-terra' 
                      : 'text-custom-dark hover:bg-custom-cream/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              {user ? (
                <>
                  <div className="px-3 py-2 text-custom-dark font-medium border-t border-gray-200 mt-2 pt-2">
                    Signed in as {user.username}
                  </div>
                  <Link 
                    to="/account" 
                    className="block px-3 py-2 rounded-md text-custom-dark hover:bg-custom-cream/50"
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="block px-3 py-2 rounded-md text-custom-dark hover:bg-custom-cream/50"
                  >
                    Favorites
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-custom-terra hover:bg-custom-cream/50"
                  >
                    Logout
                  </button>
                  {isAdmin() && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-3 py-2 rounded-md text-custom-dark hover:bg-custom-cream/50 mt-2"
                    >
                      <div className="flex items-center">
                        <FaShieldAlt className="mr-2" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                </>
              ) : (
                <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col space-y-1">
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded-md text-custom-dark hover:bg-custom-cream/50"
                  >
                    Login
                  </Link>
                  <Link               
                    to="/register"               
                    className="px-3 py-2 rounded-md bg-custom-terra text-white hover:bg-custom-sage"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
