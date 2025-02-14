import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Log in to your account</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
          <Button type="submit">Log in</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
