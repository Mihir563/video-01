// components/images/ImageCarousel/ReorderModal.tsx
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, Save, Menu, MoveHorizontal, MinusCircle } from "lucide-react";
import type { UserImage } from "@/types";

export interface ReorderModalProps {
  reorderedIds: string[];
  allImages: UserImage[];
  onClose: (saveChanges: boolean) => void;
  onReorder: (newOrder: string[]) => void;
  onRemoveImage: (imageId: string) => void;
}

export default function ReorderModal({
  reorderedIds,
  allImages,
  onClose,
  onReorder,
  onRemoveImage,
}: ReorderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Get the actual reordered image objects
  const reorderedImages = reorderedIds.map(
    (id) =>
      allImages.find((img) => img.id === id) || {
        id,
        url: "",
        title: "Image not found",
      }
  );

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Handle reordering
  const handleReorder = (newOrder: UserImage[]) => {
    const newOrderIds = newOrder.map((item) => item.id);
    onReorder(newOrderIds);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Rearrange Images
            </h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onClose(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onClose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Reorder instruction */}
          <div className="px-4 py-2 bg-blue-50 text-blue-800 text-sm flex items-center gap-2">
            <Menu className="w-4 h-4 text-blue-600" />
            <p>Drag and drop to reorder. Changes only apply after saving.</p>
          </div>

          {/* Reorderable content */}
          <div className="flex-1 overflow-y-auto p-4">
            <Reorder.Group
              axis="y"
              //@ts-expect-error: just ignore this man!
              values={reorderedImages}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {reorderedImages.map((image, index) => (
                <ReorderItem
                  key={image.id}
                  //@ts-expect-error: just ignore this man!
                  image={image}
                  index={index}
                  onRemove={() => {
                    const newIds = reorderedIds.filter((id) => id !== image.id);
                    onReorder(newIds);
                    onRemoveImage(image.id);
                  }}
                />
              ))}
            </Reorder.Group>
          </div>

          {/* Modal footer with action buttons */}
          <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center bg-gray-50 rounded-b-xl">
            <span className="text-sm text-gray-500">
              {reorderedImages.length}{" "}
              {reorderedImages.length === 1 ? "image" : "images"}
            </span>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onClose(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onClose(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper component for reorder item
// components/images/ImageCarousel/ReorderModal.tsx (continued)

// Helper component for reorder item
function ReorderItem({ 
  image, 
  index,
  onRemove 
}: { 
  image: UserImage; 
  index: number;
  onRemove: () => void;
}) {
  return (
    <Reorder.Item
      key={image.id}
      value={image}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="flex items-center p-2 cursor-move active:bg-gray-50">
        <div className="flex items-center justify-center mr-3 text-gray-400">
          <MoveHorizontal className="w-5 h-5" />
        </div>

        <div className="relative h-16 w-16 flex-shrink-0 mr-3">
          <Image
            src={image.url}
            alt={image.title}
            width={64}
            height={64}
            className="object-cover rounded-md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-gray-900 truncate">
              {image.title || `Image ${index + 1}`}
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {index + 1}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 p-1 text-gray-400 hover:text-red-500"
        >
          <MinusCircle className="w-5 h-5" />
        </button>
      </div>
    </Reorder.Item>
  );
}