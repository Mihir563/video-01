// components/images/ImageCarousel/SelectedImagesCarousel.tsx (refactored)
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import type { UserImage } from "@/types";
import CarouselItem from "./CarouselItem";
import FullscreenView from "./FullscreenView";
import ReorderModal from "./ReorderModal";
import { useSwipe } from "./hooks/useSwipe";

interface SelectedImagesCarouselProps {
  selectedImageIds: string[];
  allImages: UserImage[];
  onRemoveImage: (imageId: string) => void;
  onReorderImages?: (newOrder: string[]) => void;
}

export default function SelectedImagesCarousel({
  selectedImageIds,
  allImages,
  onRemoveImage,
  onReorderImages,
}: SelectedImagesCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [openedImage, setOpenedImage] = useState<string | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderedIds, setReorderedIds] = useState<string[]>([]);

  // Fixed visible count to 5 as per requirement
  const visibleCount = 5;

  // Get the actual image objects for the selected IDs
  const selectedImages = selectedImageIds.map(
    (id) =>
      allImages.find((img) => img.id === id) || {
        id,
        url: "",
        title: "Image not found",
      }
  );

  // Initialize reorderedIds with selectedImageIds
  useEffect(() => {
    setReorderedIds([...selectedImageIds]);
  }, [selectedImageIds]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(Math.max(0, selectedImages.length - visibleCount), prev + 1)
    );
  };

  // Use our custom swipe hook
  const { elementRef, swipeDirection, handlers } = useSwipe({
    onSwipeLeft: () => {
      if (startIndex < selectedImages.length - visibleCount) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      if (startIndex > 0) {
        handlePrev();
      }
    },
  });

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Adjust startIndex on resize if needed
      if (selectedImages.length <= visibleCount) {
        setStartIndex(0);
      } else if (startIndex > selectedImages.length - visibleCount) {
        setStartIndex(Math.max(0, selectedImages.length - visibleCount));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedImages.length, startIndex, visibleCount]);

  // Adjust startIndex if it would create an empty space at the end
  useEffect(() => {
    if (selectedImages.length <= visibleCount) {
      setStartIndex(0);
    } else if (startIndex > selectedImages.length - visibleCount) {
      setStartIndex(Math.max(0, selectedImages.length - visibleCount));
    }
  }, [selectedImages.length, startIndex, visibleCount]);

  // Handle image click to open fullscreen
  const handleImageClick = (imageId: string) => {
    setOpenedImage(imageId);
  };

  // Close opened image view
  const handleCloseImage = () => {
    setOpenedImage(null);
  };

  // Open reorder modal
  const openReorderModal = () => {
    setReorderedIds([...selectedImageIds]);
    setIsReorderModalOpen(true);
  };

  // Close reorder modal
  const closeReorderModal = (saveChanges: boolean) => {
    if (saveChanges && onReorderImages) {
      onReorderImages(reorderedIds);
    }
    setIsReorderModalOpen(false);
  };

  // Handle remove image
  const handleRemoveImage = (imageId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onRemoveImage(imageId);
    if (openedImage === imageId) {
      setOpenedImage(null);
    }
  };

  // Return early if no images selected
  if (selectedImages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6 bg-gray-100 rounded-lg text-center shadow-inner"
      >
        <p className="text-gray-500 font-medium">No images selected yet</p>
      </motion.div>
    );
  }

  const visibleImages = selectedImages.slice(
    startIndex,
    startIndex + visibleCount
  );

  // Animation variants
  const carouselVariants = {
    enter: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <>
      {/* Fixed carousel at bottom with backdrop blur for modern look */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-black/0 backdrop-blur-md border-t-2 border-gray-600 shadow-lg z-40 py-4"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-sm md:text-base ">
              <span className="inline-block bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs mr-2">
                {selectedImages.length}
              </span>
              Selected Images
            </h3>

            {/* Reorder mode toggle button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openReorderModal}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3 h-3" />
                <span className="hidden sm:inline">Rearrange</span>
              </span>
            </motion.button>
          </div>
          {/* @ts-expect-error: just ignore this man! */}
          <div ref={elementRef} {...handlers} className="relative cursor-grab">
            <div className="flex items-center">
              <div
                className={`flex mx-auto ${
                  selectedImages.length === 1
                    ? "justify-center w-full"
                    : "overflow-hidden w-full"
                }`}
              >
                <AnimatePresence custom={swipeDirection} initial={false}>
                  <motion.div
                    key={startIndex}
                    custom={swipeDirection}
                    variants={carouselVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex w-full justify-center gap-3"
                  >
                    {visibleImages.map((image) => (
                      <CarouselItem
                        key={image.id}
                        //@ts-expect-error: just ignore this man!
                        image={image}
                        position={selectedImageIds.indexOf(image.id) + 1}
                        onClick={() => handleImageClick(image.id)}
                        onRemove={(e) => handleRemoveImage(image.id, e)}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Pagination indicator */}
          {selectedImages.length > visibleCount && (
            <div className="flex justify-center mt-3">
              {Array.from({
                length: Math.ceil(selectedImages.length / visibleCount),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStartIndex(i * visibleCount)}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    Math.floor(startIndex / visibleCount) === i
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Fullscreen View Component */}
      {openedImage && (
        <FullscreenView
          imageId={openedImage}
          allImages={allImages}
          selectedImageIds={selectedImageIds}
          onClose={handleCloseImage}
          onRemove={handleRemoveImage}
        />
      )}

      {/* Reorder Modal Component */}
      {isReorderModalOpen && (
        <ReorderModal
          reorderedIds={reorderedIds}
          allImages={allImages}
          onClose={(saveChanges) => closeReorderModal(saveChanges)}
          onReorder={setReorderedIds}
          onRemoveImage={onRemoveImage}
        />
      )}
    </>
  );
}
