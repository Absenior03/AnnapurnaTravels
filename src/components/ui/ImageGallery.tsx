import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiLeftArrow, BiRightArrow, BiExpand } from 'react-icons/bi';
import { FiX } from 'react-icons/fi';
import AppleCard from './AppleCard';

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  aspectRatio?: 'square' | 'video' | 'auto';
  enableLightbox?: boolean;
  enableTilt?: boolean;
  fullWidth?: boolean;
  variant?: 'grid' | 'masonry' | 'carousel';
  cardVariant?: 'default' | 'elevated' | 'glass' | 'minimal';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  columns = 3,
  gap = 4,
  aspectRatio = 'auto',
  enableLightbox = true,
  enableTilt = true,
  fullWidth = false,
  variant = 'grid',
  cardVariant = 'default',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Navigate to next image
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLoading(true);
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Navigate to previous image
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLoading(true);
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle key press in lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  // Image loaded in lightbox
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Get grid columns class
  const getColumnsClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Get gap class
  const getGapClass = () => {
    return `gap-${gap}`;
  };

  // Render gallery based on variant
  const renderGallery = () => {
    switch (variant) {
      case 'masonry':
        return (
          <div className={`columns-${columns} ${getGapClass()} space-y-${gap}`}>
            {images.map((image, index) => (
              <div key={index} className="break-inside-avoid mb-4">
                <AppleCard
                  image={image.src}
                  alt={image.alt}
                  title={image.title || ''}
                  description={image.description || ''}
                  aspectRatio="auto"
                  enableTilt={enableTilt}
                  variant={cardVariant}
                  onClick={() => openLightbox(index)}
                  className="w-full h-full cursor-pointer"
                />
              </div>
            ))}
          </div>
        );
      case 'carousel':
        return (
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="snap-start shrink-0 pr-4" 
                  style={{ width: columns === 1 ? '100%' : `${100 / (Math.min(columns, 2))}%` }}
                >
                  <AppleCard
                    image={image.src}
                    alt={image.alt}
                    title={image.title || ''}
                    description={image.description || ''}
                    aspectRatio={aspectRatio}
                    enableTilt={enableTilt}
                    variant={cardVariant}
                    onClick={() => openLightbox(index)}
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        );
      case 'grid':
      default:
        return (
          <div className={`grid ${getColumnsClass()} ${getGapClass()}`}>
            {images.map((image, index) => (
              <AppleCard
                key={index}
                image={image.src}
                alt={image.alt}
                title={image.title || ''}
                description={image.description || ''}
                aspectRatio={aspectRatio}
                enableTilt={enableTilt}
                variant={cardVariant}
                onClick={() => openLightbox(index)}
                className="h-full w-full"
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className={`${fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto'} ${className}`}
      onKeyDown={lightboxOpen ? handleKeyDown : undefined}
      tabIndex={lightboxOpen ? 0 : -1}
    >
      {renderGallery()}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white bg-black/20 rounded-full p-2 hover:bg-black/40 transition-colors z-20"
              onClick={closeLightbox}
            >
              <FiX size={24} />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white p-3 rounded-full hover:bg-black/40 transition-colors z-20"
              onClick={prevImage}
            >
              <BiLeftArrow size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white p-3 rounded-full hover:bg-black/40 transition-colors z-20"
              onClick={nextImage}
            >
              <BiRightArrow size={24} />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative max-w-full max-h-full overflow-hidden"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  className="max-w-full max-h-[90vh] object-contain"
                  onLoad={handleImageLoad}
                />
                {(images[activeIndex].title || images[activeIndex].description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    {images[activeIndex].title && (
                      <h3 className="text-lg font-medium">{images[activeIndex].title}</h3>
                    )}
                    {images[activeIndex].description && (
                      <p className="text-sm text-gray-200 mt-1">{images[activeIndex].description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/20 px-4 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;

// Add this to your global CSS
// .hide-scrollbar::-webkit-scrollbar {
//   display: none;
// }
// .hide-scrollbar {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// } 