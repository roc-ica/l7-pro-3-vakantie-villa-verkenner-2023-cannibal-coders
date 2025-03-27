import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';

// ...existing code...

const navigation = [
  // ...existing routes...
  {
    name: 'Properties',
    icon: FaHome,
    subItems: [
      { name: 'All Properties', href: '/admin/properties' },
      { name: 'Featured Properties', href: '/admin/properties/featured', icon: FaStar },
      { name: 'Add New Property', href: '/admin/properties/create' },
    ]
  },
  // ...existing routes...
];

// ...existing code...