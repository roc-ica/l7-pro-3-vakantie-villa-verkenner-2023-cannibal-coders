import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTachometerAlt, FaHome, FaUsers, FaTicketAlt, 
  FaImages, FaCog, FaBars, FaTimes, FaSignOutAlt,
  FaChevronDown, FaChevronUp, FaGlobe
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    properties: false,
    users: false,
    content: false
  });

  // Navigation items with nested structure
  const navItems = [
    { 
      path: '/admin/dashboard', 
      name: 'Dashboard', 
      icon: FaTachometerAlt 
    },
    { 
      id: 'properties',
      name: 'Properties', 
      icon: FaHome,
      submenu: [
        { path: '/admin/properties', name: 'All Properties' },
        { path: '/admin/properties/create', name: 'Add Property' },
        { path: '/admin/properties/featured', name: 'Featured Properties' }
      ]
    },
    { 
      id: 'users',
      name: 'Users', 
      icon: FaUsers,
      submenu: [
        { path: '/admin/users', name: 'All Users' },
        { path: '/admin/users/create', name: 'Add User' }
      ]
    },
    { 
      path: '/admin/tickets', 
      name: 'Customer Tickets', 
      icon: FaTicketAlt 
    },
    { 
      id: 'content',
      name: 'Content', 
      icon: FaImages,
      submenu: [
        { path: '/admin/content/hero', name: 'Hero Banners' },
        { path: '/admin/content/testimonials', name: 'Testimonials' }
      ]
    },
    { 
      path: '/admin/settings', 
      name: 'Settings', 
      icon: FaCog 
    }
  ];

  const toggleSubmenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a submenu contains the active path
  const isSubmenuActive = (submenu: Array<{ path: string }>) => {
    return submenu.some(item => item.path === location.pathname);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-white shadow-md text-custom-charcoal hover:text-custom-terra"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 w-64 bg-custom-dark text-white z-20 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        {/* Admin Logo/Title */}
        <div className="h-16 flex items-center justify-center bg-custom-terra">
          <h2 className="text-lg font-bold">Villa Admin</h2>
        </div>
        
        {/* Admin Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-custom-sage flex items-center justify-center text-white font-bold">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {/* Return to Main Site Link */}
            <li className="mb-4">
              <Link 
                to="/"
                className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-custom-charcoal/40"
                onClick={() => setSidebarOpen(false)}
              >
                <FaGlobe className="w-5 h-5 mr-3" />
                <span>Return to Main Site</span>
              </Link>
            </li>
            
            <li className="border-b border-gray-700 mb-2 pb-2"></li>
            
            {navItems.map((item, index) => (
              <li key={index}>
                {/* Regular menu item */}
                {'path' in item && item.path ? (
                  <Link 
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-custom-terra text-white'
                        : 'text-gray-300 hover:bg-custom-charcoal/40'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  // Submenu parent
                  <div>
                    <button
                      onClick={() => item.id && toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        (item.id && expandedMenus[item.id]) || (item.submenu && isSubmenuActive(item.submenu))
                          ? 'bg-custom-terra/20 text-white'
                          : 'text-gray-300 hover:bg-custom-charcoal/40'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                      </div>
                      {item.id && expandedMenus[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    
                    {/* Submenu items */}
                    {item.id && expandedMenus[item.id] && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                              location.pathname === subItem.path
                                ? 'bg-custom-terra text-white'
                                : 'text-gray-300 hover:bg-custom-charcoal/30'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {/* Logout Button */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-800/30 hover:text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </motion.aside>
      
      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64 transition-all min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-custom-dark">{title}</h1>
        </header>
        
        {/* Page Content */}
        <main className="p-6 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
