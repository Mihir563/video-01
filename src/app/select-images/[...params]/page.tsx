"use client";

import { useState, useEffect, use } from "react";
import ImageGrid from "@/components/images/image-grid";
import { fetchTemplates } from "@/data/templates";
import type { UserImage } from "@/types";
import MaxImagesModal from "@/components/modal/MaximumImage";
import { Template } from "@/types";
import Pagination from "@/components/Pagination";
import ContactFormModal from "@/components/modal/ContactFormModal";
import SelectedImagesCarousel from "@/components/images/ImageCarousel/SelectedImagesCarousel";

export default function SelectImagesPage({
  params: paramsPromise,
}: {
  params: Promise<{ params: string[] }>;
}) {
  const { params } = use(paramsPromise);

  const [kind, templateId] = params;

  // State for template
  const [template, setTemplate] = useState<Template | undefined>(undefined);

  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [isMaxImagesModalOpen, setIsMaxImagesModalOpen] = useState(false);
  const [pendingImageToAdd, setPendingImageToAdd] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedImages, setPaginatedImages] = useState<UserImage[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [uniqueCode, setUniqueCode] = useState()
  const IMAGES_PER_PAGE = 20;

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const fetchedTemplates = await fetchTemplates();
        const foundTemplate = fetchedTemplates.find(t => t.template_id === kind);
        setTemplate(foundTemplate);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };
    
    getTemplate();
  }, [kind]);

  useEffect(() => {

    setAlbumId(templateId)
  }, [kind, templateId]);

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

  const MAX_SELECTED_IMAGES = template?.required_images || 2;

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
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

        const uid = data.Id

        setUniqueCode(uid)

        // Transform API data to our UserImage format
        const apiImages: UserImage[] = Object.entries(data.ImagesServer).map(
          ([key, url], index) => ({
            id: key,
            url: url as string,
            title: `Image ${key}`,
            index: index + 1, // Add index for numbering
          })
        );

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


  return (
    <div className={`container mx-auto px-4 py-12 pt-32 ${carouselHeight}`}>
      <section className="mb-12 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Select Your Media
        </h1>
        {template && (
          <p className="text-lg mb-2">
            Template: <span className="font-medium">{template.name || "template"}</span>
          </p>
        )}
        <p className="mb-8">
          Choose up to {MAX_SELECTED_IMAGES} images to create your video
        </p>
      </section>

      {/* Image selection counter */}
      <div className="mb-6 flex flex-col items-left justify-start p-4 m-2 backdrop-blur-sm rounded-lg ">
        <p className="text-sm font-medium mb-2 sm:mb-0 border p-3 rounded-lg  backdrop-blur-sm">
          Selected Images:{" "}
          <span className="text-blue-600 font-bold">
            {selectedImages.length}
          </span>
          /{MAX_SELECTED_IMAGES}
        </p>
        {selectedImages.length > 0 && (
          <button
            onClick={() => setSelectedImages([])}
            className="text-lg px-3 bg-red-50 dark:bg-red-900/30 text-red-600 mt-3 p-2 dark:text-red-400 hover:bg-red-800/40 rounded-md transition-colors duration-200"
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
          ? "bg-gray-400 cursor-not-allowed animate-wiggle text-gray-200 border-2  border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          : "text-white bg-blue-500 hover:scale-105 "
      }
    `}
          disabled={selectedImages.length < 2}
          onClick={() => setIsContactModalOpen(!isContactModalOpen)}
        >
          {selectedImages.length < 2
            ? "Please select atleast two images!"
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
        template={kind}
        albumId={albumId}
        uniqueCode={uniqueCode}
      />

      <SelectedImagesCarousel
        allImages={images}
        selectedImageIds={selectedImages}
        onRemoveImage={removeImageFromSelection}
        // @ts-expect-error: please ignore this!!
        onReorderImages={handleReplaceImage}
      />
    </div>
  );
}
