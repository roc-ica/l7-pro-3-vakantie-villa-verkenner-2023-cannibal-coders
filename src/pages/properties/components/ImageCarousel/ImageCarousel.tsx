import React, { useEffect, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaCamera, FaHome, FaTree, FaExpand, FaTimes } from 'react-icons/fa';
import { PropertyImage } from '../../../../types/property';

interface ImageCarouselProps {
  images: PropertyImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  type CategoryKey = 'all' | 'interior' | 'exterior' | 'surroundings';
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const imageCategories = {
    all: { 
      name: 'All Photos', 
      icon: FaCamera, 
      images: images || [] 
    },
    interior: { 
      name: 'Interior', 
      icon: FaHome, 
      images: images?.filter(img => img.image_type === 'interior') || [] 
    },
    exterior: { 
      name: 'Exterior', 
      icon: FaHome, 
      images: images?.filter(img => img.image_type === 'exterior') || [] 
    },
    surroundings: { 
      name: 'Surroundings', 
      icon: FaTree, 
      images: images?.filter(img => img.image_type === 'surroundings') || [] 
    },
  };

  // Filter categories with no images
  const availableCategories: typeof imageCategories = Object.entries(imageCategories)
    .filter(([_, { images }]) => images.length > 0)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as typeof imageCategories);

  const activeImages = imageCategories[selectedCategory].images;

  const getImageUrl = (image: PropertyImage | undefined): string => {
    if (!image) return '';
    return image.image_url;
  };

  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }

      if (isAutoPlaying && !isPaused && activeImages?.length > 1) {
        autoPlayInterval.current = setInterval(() => {
          setCurrentImageIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex >= activeImages.length ? 0 : nextIndex;
          });
        }, 3500);
      }
    };

    startAutoPlay();

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, isPaused, activeImages]);

  const handleImageClick = () => {
    setIsPaused(!isPaused);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setIsPaused(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as CategoryKey);
    setCurrentImageIndex(0); // Reset the image index when changing categories
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[400px] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-custom-cream/20 rounded-full p-6 inline-flex mb-4">
            <FaCamera className="text-4xl text-custom-terra/50" />
          </div>
          <h3 className="text-xl font-medium text-custom-dark mb-2">No Images Available</h3>
          <p className="text-custom-charcoal">This property doesn't have any photos yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      bg-white rounded-xl shadow-lg overflow-hidden
      ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
    `}>
      <div className="relative">
        {/* Main image display */}
        <div 
          className={`relative overflow-hidden cursor-pointer ${isFullscreen ? 'h-screen' : 'h-[500px]'}`}
          onClick={handleImageClick}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={getImageUrl(activeImages[currentImageIndex])}
              alt={activeImages[currentImageIndex]?.description || 'Property image'}
              className="object-cover w-full h-full"
              initial={{ opacity: 0.8, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
          
          {/* Overlay with image navigation buttons */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            {/* Top controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
              <div className="text-white">
                <span className="font-medium">{currentImageIndex + 1}</span>
                <span className="text-white/80"> / {activeImages.length}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoPlay();
                  }}
                  className="bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full p-2 text-white transition-colors"
                >
                  {isAutoPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full p-2 text-white transition-colors"
                >
                  <FaExpand />
                </button>
              </div>
            </div>
            
            {/* Caption */}
            {activeImages[currentImageIndex]?.description && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm">{activeImages[currentImageIndex].description}</p>
              </div>
            )}
            
            {/* Left/Right navigation */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === 0 ? activeImages.length - 1 : prev - 1
                    );
                    setIsPaused(true);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full p-3 transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === activeImages.length - 1 ? 0 : prev + 1
                    );
                    setIsPaused(true);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full p-3 transition-colors"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
          
          {/* Pause indicator */}
          <AnimatePresence>
            {isPaused && isAutoPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-full p-5">
                  <FaPause className="text-3xl text-white/90" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Bottom dots for navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex space-x-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full">
              {activeImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                    setIsPaused(true);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-6 bg-custom-terra' 
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="p-4 border-t border-gray-100">
            {/* Category Navigation */}
            <div className="mb-4 overflow-x-auto">
              <div className="flex space-x-2">
                {Object.entries(availableCategories).map(([category, { name, icon: Icon }]) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors
                    ${selectedCategory === category 
                        ? 'bg-custom-terra text-white' 
                        : 'bg-custom-cream/30 text-custom-charcoal hover:bg-custom-cream'
                      }`}
                  >
                    <Icon className="mr-2" />
                    {name}
                    <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                      {imageCategories[category as CategoryKey].images.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-6 gap-2">
              {activeImages.map((image, index) => (
                <motion.button
                  key={image.id || index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsPaused(true);
                  }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden
                    ${currentImageIndex === index 
                      ? 'ring-2 ring-custom-terra shadow-md' 
                      : 'ring-1 ring-gray-100'
                    }
                  `}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={image.description || `Property image ${index + 1}`}
                    className={`object-cover w-full h-full transition-all duration-300
                      ${currentImageIndex !== index ? 'filter grayscale-[30%] hover:grayscale-0' : ''}
                    `}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen close button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-3 z-10"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
function toggleFullscreen(event: React.MouseEvent<HTMLButtonElement>): void {
  throw new Error('Function not implemented.');
}

