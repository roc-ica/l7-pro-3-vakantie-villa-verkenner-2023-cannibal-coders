import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/properties" element={<PropertyPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/account" element={<UserPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
