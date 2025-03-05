import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaMapMarkerAlt, FaMapPin, FaSadTear, FaPlus, FaMinus, FaExpand, FaCompress, FaLayerGroup, FaDirections, FaTimes, FaStar, FaBed, FaDollarSign } from 'react-icons/fa';
import { Property } from '../../types/property';
import { formatPrice } from '../../utils/formatters';

interface MapViewProps {
  properties: Property[];
}

type MapLayer = 'standard' | 'satellite' | 'terrain';

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLayer, setMapLayer] = useState<MapLayer>('standard');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  
  // Fake map center coordinates (simulated Australia location)
  const [mapCenter, setMapCenter] = useState({ lat: -25.2744, lng: 133.7751 });
  
  // Generate semi-realistic coordinates for properties based on their ID
  const getPropertyCoordinates = (property: Property) => {
    // Use property ID to generate pseudo-random but consistent coordinates
    // This is just a simulation - in a real app, you'd use actual property coordinates
    const seed = property.id * 1000;
    const latOffset = (Math.sin(seed) * 5);
    const lngOffset = (Math.cos(seed) * 5);
    
    return {
      lat: mapCenter.lat + latOffset,
      lng: mapCenter.lng + lngOffset
    };
  };
  
  // Simulate map bounds to determine which properties are in view
  const isPropertyInView = (property: Property) => {
    // In a real map, you'd check if the property's coordinates are within the map's bounds
    // For this simulation, we'll just show all properties
    return true;
  };

  // Handle zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 10));
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  
  // Handle layer selection
  const handleLayerChange = (layer: MapLayer) => {
    setMapLayer(layer);
    setShowLayerSelector(false);
  };
  
  // Simulate map background based on selected layer
  const getMapBackground = () => {
    switch(mapLayer) {
      case 'satellite':
        return "bg-[url('https://source.unsplash.com/1600x900/?satellite,earth')] bg-cover";
      case 'terrain':
        return "bg-[url('https://source.unsplash.com/1600x900/?terrain,topography')] bg-cover";
      default:
        return "bg-[url('https://source.unsplash.com/1600x900/?map,cartography')] bg-cover";
    }
  };

  // Empty state
  if (properties.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[600px] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center p-8"
      >
        <FaSadTear className="text-5xl text-custom-cream mb-4" />
        <h3 className="text-xl font-bold text-custom-dark mb-2">No properties to display</h3>
        <p className="text-custom-charcoal max-w-md">
          We couldn't find any properties matching your criteria. Try adjusting your filters or search in a different location.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px] relative'}`}
    >
      {/* Map container */}
      <div className={`w-full h-full ${getMapBackground()} relative transition-all duration-500`} 
           style={{ transform: `scale(${zoomLevel / 10})`, transformOrigin: 'center' }}>
        
        {/* Simulated map grid lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-10">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
        
        {/* Property markers */}
        {properties.filter(isPropertyInView).map((property, index) => {
          // Get pseudo-coordinates for this property
          const coords = getPropertyCoordinates(property);
          
          // Calculate position on screen based on coordinates and zoom
          const left = ((coords.lng - mapCenter.lng + 180) % 360 - 180) * 2 + 50;
          const top = ((coords.lat - mapCenter.lat + 90) % 180 - 90) * -2 + 50;
          
          const isSelected = selectedProperty?.id === property.id;
          
          return (
            <motion.div
              key={property.id}
              style={{ left: `${left}%`, top: `${top}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
            >
              <motion.button
                onClick={() => setSelectedProperty(isSelected ? null : property)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: [1, 1.2, 1], y: [0, -5, 0] } : {}}
                transition={isSelected ? { repeat: Infinity, repeatType: "reverse", duration: 1.5 } : {}}
                className="relative group"
              >
                {/* Pulse animation for selected marker */}
                {isSelected && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-custom-terra/30"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.5, opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                
                {/* Marker */}
                <div className="relative">
                  <FaMapPin className={`text-3xl drop-shadow-lg ${isSelected ? 'text-custom-terra' : 'text-custom-sage group-hover:text-custom-terra'} transition-colors`} />
                  
                  {/* Price badge */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-full h-5 w-5 flex items-center justify-center border border-custom-terra text-xs font-bold text-custom-terra shadow-sm">
                    ${Math.floor((typeof property.price === 'number' ? property.price : 0) / 100)}
                  </div>
                </div>
                
                {/* Quick preview on hover (only show if not selected) */}
                {!isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-20">
                    <div className="bg-white rounded-lg shadow-lg text-xs p-2 text-custom-dark font-medium text-center truncate">
                      {property.name || property.title}
                    </div>
                  </div>
                )}
              </motion.button>
              
              {/* Property Info Card (when selected) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 z-30"
                  >
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(null);
                        }}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-custom-charcoal hover:text-custom-terra z-10"
                      >
                        <FaTimes />
                      </button>
                      
                      <div className="h-32 bg-custom-cream/20 relative">
                        {property.image_url && (
                          <img 
                            src={property.image_url} 
                            alt={property.name || 'Property'} 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-3 text-white">
                          <h3 className="font-bold">{property.name || property.title}</h3>
                          <div className="flex items-center text-xs">
                            <FaMapMarkerAlt className="mr-1 text-custom-terra" />
                            <span>{property.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-custom-terra">
                            {formatPrice(typeof property.price === 'number' ? property.price : 0)}
                            <span className="text-xs font-normal text-custom-charcoal"> /night</span>
                          </div>
                          
                          {property.rating && (
                            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full text-xs">
                              <FaStar className="text-yellow-500 mr-1" />
                              <span className="font-medium">{property.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between text-custom-charcoal text-sm mb-3">
                          <div className="flex items-center">
                            <FaBed className="mr-1 text-custom-sage" />
                            <span>{property.bedrooms || '?'} beds</span>
                          </div>
                          <div>
                            {property.bathrooms ? `${property.bathrooms} baths` : ''}
                          </div>
                        </div>
                        
                        <Link 
                          to={`/property/${property.id}`}
                          className="block w-full bg-custom-terra text-white text-center py-2 rounded-lg hover:bg-custom-sage transition-colors"
                        >
                          View Details
                        </Link>
                        
                        <button className="w-full mt-2 text-custom-terra text-sm flex items-center justify-center py-1 hover:underline">
                          <FaDirections className="mr-1" /> Get Directions
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-white rounded-lg shadow-md">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            disabled={zoomLevel >= 20}
            className="w-10 h-10 flex items-center justify-center hover:bg-custom-cream/30 text-custom-dark rounded-t-lg border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            disabled={zoomLevel <= 10}
            className="w-10 h-10 flex items-center justify-center hover:bg-custom-cream/30 text-custom-dark rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus />
          </motion.button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center hover:bg-custom-cream/30 text-custom-dark"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </motion.button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLayerSelector(!showLayerSelector)}
            className="w-10 h-10 flex items-center justify-center hover:bg-custom-cream/30 text-custom-dark"
          >
            <FaLayerGroup />
          </motion.button>
          
          {/* Layer Selection Dropdown */}
          <AnimatePresence>
            {showLayerSelector && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden w-36 z-20"
              >
                {(['standard', 'satellite', 'terrain'] as MapLayer[]).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => handleLayerChange(layer)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-custom-cream/30 flex items-center
                              ${mapLayer === layer ? 'bg-custom-cream/20 font-medium text-custom-terra' : 'text-custom-charcoal'}`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      layer === 'standard' ? 'bg-blue-300' : 
                      layer === 'satellite' ? 'bg-green-700' : 
                      'bg-amber-700'
                    }`}></div>
                    {layer.charAt(0).toUpperCase() + layer.slice(1)} Map
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Map legend & information */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-custom-dark">
            <span className="text-custom-terra">{properties.length}</span> properties shown
          </p>
          
          <div className="text-xs text-custom-charcoal ml-3">
            Zoom: {zoomLevel - 9}x
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-custom-charcoal">
          <div className="flex items-center">
            <FaDollarSign className="text-custom-terra mr-1" />
            Avg price: {formatPrice(Math.floor(properties.reduce((sum, p) => 
              sum + (typeof p.price === 'number' ? p.price : 0), 0) / properties.length))}
          </div>
        </div>
      </div>
      
      {/* Reset button when fullscreen */}
      {isFullscreen && (
        <motion.button
          onClick={() => setSelectedProperty(null)}
          className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md px-4 py-2 text-custom-dark hover:bg-custom-cream/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset View
        </motion.button>
      )}
    </motion.div>
  );
};

export default MapView;
