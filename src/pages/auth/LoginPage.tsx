import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to '/'
  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = () => {
    if (!email || !password) {
      setValidationError('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password });
      // Navigate to the page the user was trying to access, or home if no redirect
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  // Quick login functions for demo purposes
  const loginAsAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmail('admin@example.com');
    setPassword('password123');
  };

  const loginAsUser = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmail('user@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-cream py-12 px-4">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-custom-dark">Welcome Back</h2>
          <p className="mt-2 text-sm text-custom-charcoal">Sign in to access your account</p>
        </div>

        {/* Demo Account Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-blue-800 font-medium">Demo Accounts</h3>
              <p className="text-blue-700 text-sm mt-1">
                You can use the following accounts for testing:
              </p>
              <div className="mt-3 space-y-2">
                <button 
                  onClick={loginAsAdmin}
                  className="flex items-center text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded transition-colors w-full"
                >
                  <FaShieldAlt className="mr-1" /> 
                  <span className="font-medium">Admin:</span> 
                  <span className="ml-1">admin@example.com / password123</span>
                </button>
                <button 
                  onClick={loginAsUser}
                  className="flex items-center text-xs bg-green-100 hover:bg-green-200 text-green-800 py-1 px-2 rounded transition-colors w-full"
                >
                  <FaUser className="mr-1" /> 
                  <span className="font-medium">User:</span> 
                  <span className="ml-1">user@example.com / password123</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {(validationError || error) && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
              {validationError || error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-custom-charcoal mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-custom-terra" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-custom-terra focus:border-custom-terra"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-custom-charcoal mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-custom-terra" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-custom-terra focus:border-custom-terra"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-custom-terra focus:ring-custom-terra border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-custom-charcoal">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-custom-terra hover:text-custom-sage">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-custom-terra hover:bg-custom-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-terra disabled:opacity-70 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-custom-charcoal">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-custom-terra hover:text-custom-sage">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
