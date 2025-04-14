import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRequireAuthProps {
  children: React.ReactNode;
}

const AdminRequireAuth: React.FC<AdminRequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-custom-cream border-t-custom-terra rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-custom-charcoal">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  // User is admin, render children
  return <>{children}</>;
};

export default AdminRequireAuth;
