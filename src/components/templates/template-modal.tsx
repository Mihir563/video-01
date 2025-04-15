"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Template } from "@/types";

interface TemplateModalProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
}

interface AlbumCodeProps {
  albumId: string | null;
}

export default function TemplateModal({
  template,
  isOpen,
  onClose,
}: TemplateModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [albumId, setAlbumId] = useState<string | null>(null);

  // Extract album ID from URL query parameter 'c' if present
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const albumCodeValue = queryParams.get("c");
    const albumCode: AlbumCodeProps = { albumId: albumCodeValue };
    if (albumCodeValue) {
      setAlbumId(albumCode.albumId);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Animate in
      if (overlayRef.current) overlayRef.current.classList.add("open");
      if (contentRef.current) contentRef.current.classList.add("open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    // Animate out
    if (overlayRef.current) overlayRef.current.classList.remove("open");
    if (contentRef.current) contentRef.current.classList.remove("open");

    // Delay actual closing to allow animation to complete
    setTimeout(onClose, 300);
  };

  const handleSelectTemplate = () => {
    handleClose();
    // Navigate to image selection page with the selected template
    router.push(
      `/select-images/${template.id || template.template_id}/?c=${albumId}`
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="modal-content relative bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Video container with adaptive height */}
        <div className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] overflow-hidden">
          <video
            src={template.gif_url}
            poster={
              template.gif_url || template.thumb_url || "/placeholder.svg"
            }
            className="w-full h-full object-cover"
            controls
            autoPlay
            loop
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-accent">
            {template.title || template.name}
          </h2>
          <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
            {template.description ||
              `template with ${template.required_images} required images`}
          </p>
          <div className="mb-3 text-xs sm:text-sm">
            <p>
              <span className="font-semibold">Template ID:</span>{" "}
              {template.template_id}
            </p>
            <p>
              <span className="font-semibold">Required Images:</span>{" "}
              {template.required_images}
            </p>
            <p>
              <span className="font-semibold">Folder Prefix:</span>{" "}
              {template.folder_prefix}
            </p>
          </div>
        </div>

        {/* Fixed buttons at bottom */}
        <div className="p-3 sm:p-4 md:p-6 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={handleSelectTemplate}
              className="px-4 sm:px-6 py-2 rounded-lg bg-blue-500 font-medium hover:bg-blue-400 transition-colors duration-300 flex-1 text-white text-sm sm:text-base"
            >
              Select
            </button>
            <button
              onClick={handleClose}
              className="px-4 sm:px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 flex-1 text-gray-900 dark:text-white text-sm sm:text-base"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
