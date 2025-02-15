import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Create an account</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <Button type="submit">Register</Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
