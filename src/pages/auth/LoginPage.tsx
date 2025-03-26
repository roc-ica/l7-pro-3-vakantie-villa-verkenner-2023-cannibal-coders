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
    <div className="min-h-screen flex" style={{ backgroundColor: '#E5E5DD' }}>
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80')" }}>
        {/* Australian landscape image */}
        <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-white text-5xl font-bold px-12">Australian Villa Getaways</div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif" style={{ color: '#171D26' }}>LOGIN</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {(validationError || error) && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                {validationError || error}
              </div>
            )}
            
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-3 px-3 text-white rounded-lg border-2"
                style={{ 
                  backgroundColor: '#ffff', 
                  borderColor: '#586159',
                  outlineColor: '#A6685B'
                }}
                placeholder="Email"
              />
            </div>
            
            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full py-3 px-3 text-white rounded-lg border-2"
                style={{ 
                  backgroundColor: '#ffff', 
                  borderColor: '#586159',
                  outlineColor: '#A6685B'
                }}
                placeholder="Password"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 border-gray-300 rounded"
                style={{ 
                  accentColor: '#A6685B'
                }}
              />
              <label htmlFor="remember" className="ml-2 block text-sm" style={{ color: '#626265' }}>
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-1/3 ml-auto flex justify-center py-3 px-4 border-0 rounded-lg text-white transition-colors"
                style={{ 
                  backgroundColor: '#A6685B',
                  opacity: loading ? '0.7' : '1'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#8a574b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A6685B'}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          {/* <div className="flex justify-between items-center mt-6">
            <Link to="/search" className="hover:underline" style={{ color: '#586159' }}>Search</Link>
            <Link to="/properties" className="hover:underline" style={{ color: '#586159' }}>Properties</Link>
            <Link to="/register" className="hover:underline" style={{ color: '#586159' }}>Register</Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;