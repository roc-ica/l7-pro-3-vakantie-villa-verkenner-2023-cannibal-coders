import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
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
      await register({
        username,
        email,
        password
      });
      navigate('/user');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#E5E5DD' }}>
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80')" }}>
        {/* Australian landscape image */}
        <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-white text-5xl font-bold px-12">Join Our Australian Adventure</div>
        </div>
      </div>
      
      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif" style={{ color: '#171D26' }}>REGISTER</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {(validationError || error) && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                {validationError || error}
              </div>
            )}
            
            <div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full py-3 px-3 text-black rounded-lg border-2"
                style={{ 
                  backgroundColor: '#ffff', 
                  borderColor: '#586159',
                  outlineColor: '#A6685B'
                }}
                placeholder="Username"
              />
            </div>
            
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-3 px-3 text-black rounded-lg border-2"
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
                className="block w-full py-3 px-3 text-black rounded-lg border-2"
                style={{ 
                  backgroundColor: '#ffff', 
                  borderColor: '#586159',
                  outlineColor: '#A6685B'
                }}
                placeholder="Password"
              />
            </div>
            
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full py-3 px-3 text-black rounded-lg border-2"
                style={{ 
                  backgroundColor: '#ffff', 
                  borderColor: '#586159',
                  outlineColor: '#A6685B'
                }}
                placeholder="Confirm Password"
              />
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
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p style={{ color: '#626265' }}>
              Already have an account? {' '}
              <Link to="/login" className="hover:underline" style={{ color: '#A6685B' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
