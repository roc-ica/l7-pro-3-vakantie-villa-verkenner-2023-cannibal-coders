import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone, FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
      ]
    },
    {
      title: 'Properties',
      links: [
        { label: 'All Properties', href: '/properties' },
        { label: 'Featured Villas', href: '/featured' },
        { label: 'New Listings', href: '/new' },
        { label: 'Explore Destinations', href: '/destinations' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'FAQs', href: '/faq' }
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '123 Luxury Lane, Sydney, Australia' },
    { icon: FaEnvelope, text: 'info@vakantievila.com' },
    { icon: FaPhone, text: '+61 (0) 123 456 789' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-custom-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Brand Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="col-span-1"
          >
            <motion.div variants={itemVariants}>
              <Link to="/" className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-white">Vakantie <span className="text-custom-terra">Vila</span></span>
              </Link>
              <p className="mt-4 text-custom-cream/80">
                Find your perfect vacation property with our extensive collection of luxury villas across Australia.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 space-y-3">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex items-center">
                  <item.icon className="text-custom-terra mr-3" />
                  <span className="text-custom-cream/80">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <motion.div 
              key={section.title}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h3 variants={itemVariants} className="text-xl font-semibold text-white mb-6">
                {section.title}
              </motion.h3>
              <motion.ul variants={containerVariants} className="space-y-3">
                {section.links.map((link) => (
                  <motion.li key={link.label} variants={itemVariants}>
                    <Link
                      to={link.href}
                      className="text-custom-cream/80 hover:text-custom-terra transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div 
          className="py-8 border-t border-custom-charcoal/30 border-b"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-semibold">Subscribe to our newsletter</h4>
              <p className="text-custom-cream/70 mt-1">Get the latest updates and offers</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 bg-white/10 border border-custom-charcoal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra/50 text-white placeholder:text-custom-cream/50 min-w-[250px]"
                />
                <button className="px-6 py-3 bg-custom-terra hover:bg-custom-sage text-white rounded-lg transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-custom-cream/70">
              © {currentYear} Vakantie Vila. All rights reserved.
            </p>
            
            <div className="flex items-center">
              <span className="text-custom-cream/70">Made with</span>
              <FaHeart className="text-custom-terra mx-2"/>
              <span className="text-custom-cream/70">in Australia</span>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  className={`text-custom-cream/70 ${color} transition-colors`}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Icon className="w-5 h-5" />
                  </motion.div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
