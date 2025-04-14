import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { GiBoomerang, GiKangaroo } from 'react-icons/gi';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  // Australian slang phrases for the Easter egg
  const aussieSlang = [
    "Crikey! Are you sure about this, mate?",
    "Fair dinkum, this property will be gone for good!",
    "Strewth! This'll delete the property faster than a roo can hop!",
    "You're not just throwing this on the barbie, it'll be gone forever!"
  ];

  // Close on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onCancel]);

  // Handle title click for Easter egg
  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 3) {
      setShowEasterEgg(true);
      setClickCount(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-custom-dark/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center" onClick={handleTitleClick}>
                {showEasterEgg ? (
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: 1 }}
                    className="mr-3"
                  >
                    <GiKangaroo size={24} />
                  </motion.div>
                ) : (
                  <FaExclamationTriangle className="mr-3" />
                )}
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <button 
                onClick={onCancel} 
                className="text-white hover:text-white/80"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-custom-charcoal mb-6">
                {showEasterEgg 
                  ? aussieSlang[Math.floor(Math.random() * aussieSlang.length)]
                  : message
                }
              </p>

              {/* Australian Easter Egg */}
              {showEasterEgg && (
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: 0.2 }
                  }}
                >
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        x: [0, 100, 0],
                        rotateZ: [0, 360, 720]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 2
                      }}
                      className="text-custom-terra"
                    >
                      <GiBoomerang size={36} />
                    </motion.div>
                  </div>
                  <p className="text-sm mt-2 text-custom-terra">
                    G'day! Click the boomerang for good luck!
                  </p>
                </motion.div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-custom-charcoal hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  {cancelLabel}
                </button>
                <motion.button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center min-w-[100px]"
                  disabled={isDeleting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isDeleting ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-2"
                      />
                      Deleting...
                    </>
                  ) : showEasterEgg ? 'Too Right!' : confirmLabel}
                </motion.button>
              </div>
            </div>

            {/* Australian flag pattern - subtle background element */}
            {showEasterEgg && (
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <div className="w-full h-full bg-blue-800">
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white">
                    <div className="absolute left-0 top-0 w-full h-full">
                      {/* Simplified flag pattern */}
                      <div className="absolute left-[45%] top-[50%] w-[10%] h-[40%] bg-red-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute left-[50%] top-[45%] w-[40%] h-[10%] bg-red-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
