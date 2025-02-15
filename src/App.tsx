import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import PropertyPage from './features/properties/PropertyPage';
import SearchPage from './features/search/SearchPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import PropertyDetailsPage from './features/properties/PropertyDetailsPage';
import Footer from './components/common/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/properties" element={<PropertyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
