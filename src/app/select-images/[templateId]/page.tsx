"use client";

import { useState, useEffect, use } from "react";
import ImageGrid from "@/components/images/image-grid";
import { templates } from "@/data/templates";
import type { UserImage } from "@/types";
import MaxImagesModal from "@/components/modal/MaximumImage";
import Pagination from "@/components/Pagination";
import ContactFormModal from "@/components/modal/ContactFormModal";

export default function SelectImagesPage({
  params: paramsPromise,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const params = use(paramsPromise); // Unwrap params using React.use()
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState<string | null>("2800851DKU");
  const [isMaxImagesModalOpen, setIsMaxImagesModalOpen] = useState(false);
  const [pendingImageToAdd, setPendingImageToAdd] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedImages, setPaginatedImages] = useState<UserImage[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const IMAGES_PER_PAGE = 20;

  useEffect(() => {
    if (params.templateId) {
      setAlbumId(params.templateId);
    }
  }, [params.templateId]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const endIndex = startIndex + IMAGES_PER_PAGE;
    setPaginatedImages(images.slice(startIndex, endIndex));
  }, [images, currentPage]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the image grid
    window.scrollTo({
      top: document.getElementById("image-grid")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const template = templates.find((t) => t.id === params.templateId);
  const MAX_SELECTED_IMAGES = 10;

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        console.log("[ImageLoader] Fetching images from API");
        const response = await fetch(
          `https://studio.codnix.com/creation/ealbum/${albumId}.json`
        );
        if (!response.ok) {
          console.error(
            `[ImageLoader] API responded with status: ${response.status}`
          );
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        console.log("[ImageLoader] Images data received successfully");

        // Transform API data to our UserImage format
        const apiImages: UserImage[] = Object.entries(data.ImagesServer).map(
          ([key, url], index) => ({
            id: key,
            url: url as string,
            title: `Image ${key}`,
            index: index + 1, // Add index for numbering
          })
        );

        console.log(`[ImageLoader] Processed ${apiImages.length} images`);
        setImages(apiImages);
      } catch (error) {
        console.error("[ImageLoader] Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [albumId]);

  // Handle image replacement
  const handleReplaceImage = (oldImageId: string, newImageId: string) => {
    setSelectedImages((prev) => {
      // Create a new array with the old image ID replaced by the new one
      const newSelection = [...prev];
      const index = newSelection.indexOf(oldImageId);
      if (index !== -1) {
        newSelection[index] = newImageId;
      }
      console.log(newSelection);
      return newSelection;
    });

    // Clear the pending image
    setPendingImageToAdd(null);
    // Close the modal
    setIsMaxImagesModalOpen(false);
  };

  // Handle image selection
  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        // Check if we've reached the maximum number of selectable images
        if (prev.length >= MAX_SELECTED_IMAGES) {
          // Set the pending image to add
          setPendingImageToAdd(imageId);
          // Open the max images modal
          setIsMaxImagesModalOpen(true);
          // Return the current selection without adding a new one
          return prev;
        }
        return [...prev, imageId];
      }
    });
  };

  // Close max images modal
  const closeMaxImagesModal = () => {
    setIsMaxImagesModalOpen(false);
    setPendingImageToAdd(null); // Clear the pending image
  };

  // Remove image from selection
  const removeImageFromSelection = (imageId: string) => {
    setSelectedImages((prev) => prev.filter((id) => id !== imageId));

    // If we have a pending image to add, add it after removing one
    if (pendingImageToAdd) {
      setSelectedImages((prev) => [...prev, pendingImageToAdd]);
      setPendingImageToAdd(null);
      setIsMaxImagesModalOpen(false);
    }
  };

  // Add padding to the bottom of the page to prevent content from being hidden by the fixed carousel
  const carouselHeight = selectedImages.length > 0 ? "" : "";

  console.log(isContactModalOpen)
  

  return (
    <div className={`container mx-auto px-4 py-12 pt-32 ${carouselHeight}`}>
      <section className="mb-12 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Select Your Media
        </h1>
        {template && (
          <p className="text-lg mb-2">
            Template: <span className="font-medium">{template.title}</span>
          </p>
        )}
        <p className="mb-8">
          Choose up to {MAX_SELECTED_IMAGES} images and an audio file to create
          your video
        </p>
      </section>

      {/* Image selection counter */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm font-medium">
          Selected Images: {selectedImages.length}/{MAX_SELECTED_IMAGES}
        </p>
        {selectedImages.length > 0 && (
          <button
            onClick={() => setSelectedImages([])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        )}
      </div>
      <div className="mb-4">
        <Pagination
          currentPage={currentPage}
          totalItems={images.length}
          itemsPerPage={IMAGES_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Image Grid */}
      <div id="image-grid">
        <ImageGrid
          images={paginatedImages}
          loading={loading}
          selectedImages={selectedImages}
          onSelectImage={handleImageSelect}
          showIndexNumbers={true}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={images.length}
        itemsPerPage={IMAGES_PER_PAGE}
        onPageChange={handlePageChange}
      />

      {/* Video generation button */}
      <div className="mt-12 flex justify-center gap-4">
        <button
          className={`
      px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform
      ${
        selectedImages.length < 2
          ? "bg-gray-400 cursor-not-allowed animate-wiggle text-gray-200 border-2 border-dashed border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          : "text-white bg-blue-500 hover:scale-105 "
      }
    `}
          disabled={selectedImages.length < 2}
          onClick={() => 
            setIsContactModalOpen(!isContactModalOpen)}
        >
          {selectedImages.length < 2
            ? "Please select atleast tow images! 🍽️"
            : "Generate Video"}
        </button>
      </div>

      {/* Max Images Modal - Updated to show selected images */}
      <MaxImagesModal
        isOpen={isMaxImagesModalOpen}
        onClose={closeMaxImagesModal}
        selectedImages={selectedImages}
        pendingImageToAdd={pendingImageToAdd}
        maxSelectedImages={MAX_SELECTED_IMAGES}
        images={images}
        onRemoveImage={removeImageFromSelection}
        onReplaceImage={handleReplaceImage}
      />

      {/* contact form modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        selectedImages={selectedImages}
        images={images}
      />
    </div>
  );
}
