// components/images/ImageCarousel/SelectedImagesCarousel.tsx 
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import type { UserImage } from "@/types";
import FullscreenView from "./FullscreenView";
import ReorderModal from "./ReorderModal";
import Image from "next/image";
import { Maximize2, MinusCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [openedImage, setOpenedImage] = useState<string | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderedIds, setReorderedIds] = useState<string[]>([]);

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
          
          {/* Shadcn Carousel */}
          <div className="sm:w-[50%] w-full mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {selectedImages.map((image, index) => (
                  <CarouselItem key={image.id} className="basis-auto md:basis-1/5">
                    <div 
                      className="relative w-32 h-24 mx-auto cursor-pointer group"
                      onClick={() => handleImageClick(image.id)}
                    >
                      <Image
                        src={image.url}
                        alt={image.title}
                        width={138}
                        height={128}
                        className="h-full object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Image number badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-b-lg flex justify-between items-center">
                        <span>{index + 1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(image.id, e);
                          }}
                          className="text-white opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Maximize icon overlay */}
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {selectedImages.length > 1 && (
                <>
                  <CarouselPrevious className="-left-4 size-8" />
                  <CarouselNext className="-right-4 size-8" />
                </>
              )}
            </Carousel>
          </div>
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
