import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import PropertyPage from './pages/properties/PropertyPage';
import SearchPage from './pages/search/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PropertyDetailsPage from './pages/properties/PropertyDetailsPage';
import UserPage from './pages/user/Account';
import Footer from './components/common/Footer';
import { AuthProvider } from './hooks/useAuth';

// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/properties/AdminProperties';
import CreatePropertyPage from './pages/admin/properties/CreatePropertyPage';
import EditPropertyPage from './pages/admin/properties/EditPropertyPage';
import AdminRequireAuth from './components/admin/AdminRequireAuth';

// Layout wrapper that conditionally renders navbar and footer
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Only render navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}
      
      <div className="flex-grow">
        {children}
      </div>
      
      {/* Only render footer on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/properties" element={<PropertyPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/account" element={<UserPage />} />
            
            {/* Admin routes (protected) */}
            <Route path="/admin/*" element={
              <AdminRequireAuth>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/create" element={<CreatePropertyPage />} />
                  <Route path="properties/edit/:id" element={<EditPropertyPage />} />
                  {/* Add more admin routes as needed */}
                </Routes>
              </AdminRequireAuth>
            } />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
