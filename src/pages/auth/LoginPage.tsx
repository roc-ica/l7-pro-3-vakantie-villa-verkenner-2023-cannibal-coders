import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

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
      navigate('/user');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Log in to your account</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {(validationError || error) && (
            <div className="text-red-500 text-sm">{validationError || error}</div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
