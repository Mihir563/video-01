"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Template } from "@/types";
import TemplateModal from "./template-modal";
import { SparklesIcon } from "lucide-react";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [templateValid, setTemplateValid] = useState(true);

  useEffect(() => {
    // Validate template data
    if (!template || (!template.name && !template.title)) {
      console.error("Invalid template data:", template);
      setTemplateValid(false);
    }
  }, [template]);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative rounded-xl overflow-hidden futuristic-border cursor-pointer bg-gradient-to-br from-card to-background shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-video relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {templateValid ? (
              <Image
                src={
                  imageError
                    ? "/placeholder.svg"
                    : template.thumbnail ||
                      template.thumb_url ||
                      "/placeholder.svg"
                }
                alt={template.title || template.name || "Template"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => {
                  console.error(
                    "Failed to load template image:",
                    template.thumbnail || template.thumb_url
                  );
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                <span className="text-sm text-accent">
                  Template preview unavailable
                </span>
              </div>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5  text-yellow-500 animate-pulse" />
            {templateValid
              ? template.title || template.name
              : "Unknown Template"}
          </h3>
          <p className="text-sm text-blue-400 line-clamp-1">
            {templateValid
              ? template.description ||
                (template.required_images
                  ? `Required images: ${template.required_images}`
                  : "No description available")
              : "Template information unavailable"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="px-4 py-2 bg-black/20 rounded-full text-sm font-medium text-blue-300 shadow-md shadow-primary/50">
            Preview Template
          </span>
        </motion.div>
      </motion.div>

      {templateValid && (
        <TemplateModal
          template={template}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
