// components/images/ImageCarousel/FullscreenView.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import type { UserImage } from "@/types";

export interface FullscreenViewProps {
  imageId: string;
  allImages: UserImage[];
  selectedImageIds: string[];
  onClose: () => void;
  onRemove: (imageId: string) => void;
}

export default function FullscreenView({
  imageId,
  allImages,
  selectedImageIds,
  onClose,
  onRemove,
}: FullscreenViewProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentImageId, setCurrentImageId] = useState(imageId);

  const openedImageData = allImages.find((img) => img.id === currentImageId);
  const openedImageIndex = selectedImageIds.indexOf(currentImageId);

  // Navigate between images in fullscreen mode
  const navigateFullscreen = (direction: "next" | "prev") => {
    if (!openedImageData) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (openedImageIndex + 1) % selectedImageIds.length;
    } else {
      newIndex =
        (openedImageIndex - 1 + selectedImageIds.length) %
        selectedImageIds.length;
    }

    const newImageId = selectedImageIds[newIndex];
    setCurrentImageId(newImageId);
  };

  // Keyboard navigation in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateFullscreen("next");
      if (e.key === "ArrowLeft") navigateFullscreen("prev");
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openedImageIndex, selectedImageIds]); // Add deps properly

  // Touch handlers for swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateFullscreen("next");
    }

    if (isRightSwipe) {
      navigateFullscreen("prev");
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!openedImageData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.01 }}
        className="fixed inset-0 bg-black/0 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 30 }}
          className="relative max-w-5xl w-full mx-auto"
        >
          {/* Image container with fixed dimensions */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-screen lg:max-h-[70vh]">
            <Image
              src={openedImageData.url}
              alt={openedImageData.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Control buttons with animations */}
          <div className="absolute top-1 right-15 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRemove(imageId)}
              className="p-2.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Remove image"
            >
              <span className="flex items-center gap-1.5 ">
                <Trash2 className="w-4 h-4" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2.5 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors shadow-lg"
              aria-label="Close image"
            >
              <span className="flex items-center gap-1.5">
                <X className="w-4 h-4" />
              </span>
            </motion.button>
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full flex justify-between px-1">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateFullscreen("prev")}
              className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateFullscreen("next")}
              className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Enhanced image number indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/0 backdrop-blur-sm  px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span className="text-blue-400 font-medium">
              {openedImageIndex + 1}
            </span>
            <span className="text-gray-400">/</span>
            <span>{selectedImageIds.length}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
