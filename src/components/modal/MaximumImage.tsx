import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { UserImage } from "@/types/index";
import Image from "next/image";

interface MaxImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: string[];
  pendingImageToAdd: string | null;
  maxSelectedImages: number;
  images: UserImage[];
  onRemoveImage: (imageId: string) => void;
  onReplaceImage: (oldImageId: string, newImageId: string) => void;
}

const MaxImagesModal: React.FC<MaxImagesModalProps> = ({
  isOpen,
  onClose,
  selectedImages,
  pendingImageToAdd,
  maxSelectedImages,
  images,
  onRemoveImage,
  onReplaceImage,
}) => {
  // State to track which image is selected for replacement
  const [selectedForReplacement, setSelectedForReplacement] = React.useState<
    string | null
  >(null);

  console.log(images)
  // Reset selection state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedForReplacement(null);
    }
  }, [isOpen]);

  // Find the pending image object
  const pendingImage = pendingImageToAdd
    ? images.find((img) => img.id === pendingImageToAdd)
    : null;

  // Handle image selection for replacement
  const handleSelectForReplacement = (imageId: string) => {
    setSelectedForReplacement((prevSelected) =>
      prevSelected === imageId ? null : imageId
    );
  };

  // Handle confirming the replacement
  const handleReplaceConfirm = () => {
    if (selectedForReplacement && pendingImageToAdd) {
      onReplaceImage(selectedForReplacement, pendingImageToAdd);
      onClose();
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border border-white/10 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Maximum Images Reached
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-200">
            You can select a maximum of {maxSelectedImages} images. Select which
            image to replace.
          </DialogDescription>
        </DialogHeader>

        {/* Instructions */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs">
          <p className="text-gray-200">
            {selectedForReplacement
              ? "Click 'Replace Selected' to confirm replacement"
              : "Click on an image you want to replace with the new one"}
          </p>
        </div>

        {/* Display currently selected images */}
        <div className="py-1">
          <h3 className="text-white text-sm font-medium mb-2">
            Currently Selected Images:
          </h3>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto ">
            {selectedImages.map((imageId) => {
              const image = images.find((img) => img.id === imageId);
              return image ? (
                <div
                  key={image.id}
                  onClick={() => handleSelectForReplacement(image.id)}
                  className={`
                    relative group bg-gray-800 rounded-lg overflow-hidden cursor-pointer
                    ${
                      selectedForReplacement === image.id
                        ? "ring-2 ring-red-500 scale-95"
                        : ""
                    }
                    transition-all duration-200
                  `}
                >
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-semibold p-1 rounded-br-md z-10">
                    #{image.id}
                  </div>
                  <Image
                    width={70}
                    height={20}
                    src={image.url}
                    alt={image.title}
                    className="w-full h-20 object-fill"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded-bl-md z-20"
                  >
                    <X size={14} />
                  </button>
                  {selectedForReplacement === image.id && (
                    <div className="absolute inset-0 bg-red-500/350 bg-opacity-30 flex items-center justify-center">
                      <span className="bg-red-600/90 text-white px-1 py-0.5 rounded text-xs font-bold">
                        Selected
                      </span>
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Show pending image if there is one */}
        {pendingImage && (
          <div className="py-1">
            <h3 className="text-white text-sm font-medium mb-1">
              Image You Want to Add:
            </h3>
            <div className="mx-auto max-w-xs">
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-semibold p-1 rounded-br-md z-10">
                  #{pendingImage.id}
                </div>
                <Image
                  width={100}
                  height={24}
                  src={pendingImage.url}
                  alt={pendingImage.title}
                  className="h-24 object"
                />
              </div>
            </div>
          </div>
        )}

        <div className="py-2 flex justify-center gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors shadow-md text-sm"
          >
            Cancel
          </motion.button>
          {pendingImageToAdd && (
            <motion.button
              onClick={handleReplaceConfirm}
              disabled={!selectedForReplacement}
              whileHover={selectedForReplacement ? { scale: 1.05 } : {}}
              whileTap={selectedForReplacement ? { scale: 0.95 } : {}}
              className={`
                px-4 py-2 rounded-lg font-medium text-white shadow-md text-sm
                ${
                  selectedForReplacement
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 cursor-not-allowed"
                }
                transition-colors
              `}
            >
              Replace Selected
            </motion.button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaxImagesModal;
