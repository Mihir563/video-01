"use client"

import { useState } from "react";
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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative rounded-xl overflow-hidden futuristic-border cursor-pointer bg-gradient-to-br from-card to-background shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-500"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-video relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-primary animate-pulse" />
            {template.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{template.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="px-4 py-2 bg-primary/90 rounded-full text-sm font-medium text-primary-foreground shadow-md shadow-primary/50">
            Preview Template
          </span>
        </motion.div>
      </motion.div>

      <TemplateModal template={template} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
