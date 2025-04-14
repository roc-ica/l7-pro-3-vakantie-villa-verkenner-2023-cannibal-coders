import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaCheck, FaTimes, FaGift, FaClock, FaShieldAlt, FaLeaf } from 'react-icons/fa';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: <FaGift />,
      title: 'Exclusive Offers',
      description: 'Be the first to receive special deals and promotions on luxury properties'
    },
    {
      icon: <FaClock />,
      title: 'Early Access',
      description: 'Get notified about new properties 48 hours before they go public'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Travel Tips',
      description: 'Receive expert travel advice tailored to your destination preferences'
    },
    {
      icon: <FaLeaf />,
      title: 'Eco-Friendly Stays',
      description: 'Discover our collection of sustainable and eco-conscious properties'
    }
  ];

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [features.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || submitStatus === 'submitting') return;
    
    setSubmitStatus('submitting');
    
    // Simulating API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      
      // Reset after showing success message
      setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  // Reset form
  const handleReset = () => {
    setEmail('');
    setSubmitStatus('idle');
    setAnimationComplete(false);
  };

  return (
    <section className="py-16 md:py-24 mb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-custom-terra/10"
          animate={{ 
            scale: [1, 1.2, 1],
            translateX: [0, 20, 0],
            translateY: [0, -10, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-custom-sage/10"
          animate={{ 
            scale: [1, 1.3, 1],
            translateX: [0, -30, 0],
            translateY: [0, 20, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-custom-dark mb-4">
                  Join Our <span className="text-custom-terra">Exclusive</span> Newsletter
                </h2>
                <p className="text-custom-charcoal mb-8">
                  Stay updated with the latest luxury properties and travel inspiration tailored just for you.
                </p>

                {/* Features Carousel */}
                <div className="mb-12 h-24">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="text-3xl text-custom-terra bg-custom-cream p-3 rounded-full">
                        {features[activeFeature].icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-custom-dark">
                          {features[activeFeature].title}
                        </h3>
                        <p className="text-custom-charcoal">
                          {features[activeFeature].description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Feature Indicators */}
                <div className="flex gap-2 mb-8">
                  {features.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeFeature ? 'bg-custom-terra w-6' : 'bg-custom-gray/30'
                      }`}
                      aria-label={`View feature ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-custom-sage to-custom-sage/70 p-8 md:p-12 relative">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="#fff"></circle>
                  </pattern>
                  <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                </svg>
              </div>
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && animationComplete ? (
                    <motion.div
                      key="thank-you"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-custom-terra/20 mb-4">
                        <FaCheck className="text-2xl text-custom-terra" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                      <p className="text-white/80 mb-6">You're now subscribed to our newsletter.</p>
                      <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-white text-custom-sage rounded-lg font-medium"
                      >
                        Subscribe Another Email
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col justify-center"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6">Sign Up Now</h3>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-custom-sage" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className={`w-full pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 transition-all 
                                      ${submitStatus === 'error' ? 'border-2 border-red-500 focus:ring-red-200' : 'focus:ring-custom-terra/30'}`}
                            disabled={submitStatus === 'submitting' || submitStatus === 'success'}
                            required
                          />

                          {submitStatus === 'error' && (
                            <div className="absolute top-full left-0 text-sm text-red-100 mt-1 flex items-center">
                              <FaTimes className="mr-1" /> Please try again
                            </div>
                          )}
                        </div>
                        
                        <motion.button
                          type="submit"
                          whileHover={submitStatus !== 'submitting' ? { scale: 1.03 } : {}}
                          whileTap={submitStatus !== 'submitting' ? { scale: 0.98 } : {}}
                          className="w-full py-4 bg-custom-terra hover:bg-custom-terra/90 text-white rounded-lg font-semibold 
                                  flex items-center justify-center gap-2 transition-all"
                          disabled={submitStatus === 'submitting' || submitStatus === 'success'}
                        >
                          {submitStatus === 'submitting' ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <FaPaperPlane />
                              </motion.div>
                              <span>Sending...</span>
                            </>
                          ) : submitStatus === 'success' ? (
                            <>
                              <FaCheck />
                              <span>Subscribed!</span>
                            </>
                          ) : (
                            <>
                              <FaPaperPlane />
                              <span>Subscribe</span>
                            </>
                          )}
                        </motion.button>
                      </form>
                      
                      <p className="text-white/70 text-sm mt-6">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy note - adjusted margin */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto mt-6 text-center text-custom-charcoal/70 text-sm px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Your email is safe with us. We only send relevant content and never share your information.
        View our <a href="/privacy" className="underline hover:text-custom-terra transition-colors">Privacy Policy</a>.
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
