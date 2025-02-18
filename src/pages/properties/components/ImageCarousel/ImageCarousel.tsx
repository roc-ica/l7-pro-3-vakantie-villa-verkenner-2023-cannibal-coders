import React, { useEffect, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { PropertyImage } from '../../../../types/property';

interface ImageCarouselProps {
  images: PropertyImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  const imageCategories = {
    all: images || [],
    interior: images?.filter(img => img.image_type === 'interior') || [],
    exterior: images?.filter(img => img.image_type === 'exterior') || [],
    surroundings: images?.filter(img => img.image_type === 'surroundings') || [],
  };

  const getImageUrl = (image: PropertyImage | undefined): string => {
    if (!image) return '';
    return image.image_url;
  };

  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }

      if (isAutoPlaying && !isPaused && images?.length) {
        autoPlayInterval.current = setInterval(() => {
          setCurrentImageIndex((prev) => {
            const nextIndex = prev + 1;
            const currentImages = imageCategories.all;
            return nextIndex >= currentImages.length ? 0 : nextIndex;
          });
        }, 3000);
      }
    };

    startAutoPlay();

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, isPaused, images, imageCategories.all]);

  const handleImageClick = () => {
    setIsPaused(!isPaused);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setIsPaused(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Tab.Group>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Tab.List className="flex space-x-2">
              {Object.entries(imageCategories).map(([category, images]) => (
                <Tab
                  key={category}
                  disabled={!images || images.length === 0}
                  className={({ selected }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selected 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                    ${(!images || images.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {images && images.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {images.length}
                    </span>
                  )}
                </Tab>
              ))}
            </Tab.List>
            
            <button
              onClick={toggleAutoPlay}
              className="flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
            >
              {isAutoPlaying ? (
                <>
                  <FaPause className="mr-2" />
                  Stop Slideshow
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Start Slideshow
                </>
              )}
            </button>
          </div>
        </div>

        <Tab.Panels>
          {Object.values(imageCategories).map((images, idx) => (
            <Tab.Panel key={idx} className="focus:outline-none">
              <div className="relative">
                <div 
                  className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9 cursor-pointer"
                  onClick={handleImageClick}
                >
                  {images.length > 0 ? (
                    <>
                      <img
                        src={getImageUrl(images[currentImageIndex])}
                        alt={images[currentImageIndex]?.description || 'Property image'}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex space-x-2">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'w-6 bg-white' 
                                  : 'w-1.5 bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {isPaused && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-4">
                            <FaPause className="text-2xl text-blue-600" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <p className="text-gray-500">No images available</p>
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? images.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                    >
                      <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                    >
                      <FaChevronRight className="text-gray-800" />
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-6 gap-2 p-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsPaused(true);
                    }}
                    className={`
                      relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden
                      transition-all duration-300
                      ${currentImageIndex === index 
                        ? 'ring-2 ring-blue-600 scale-105 z-10' 
                        : 'hover:scale-105'
                      }
                    `}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={image.description || `Property image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ImageCarousel;
