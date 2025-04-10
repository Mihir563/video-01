// components/images/ImageCarousel/CarouselItem.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2, MinusCircle } from "lucide-react";
import type { UserImage } from "@/types";

interface CarouselItemProps {
  image: UserImage;
  position: number;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

export default function CarouselItem({
  image,
  position,
  onClick,
  onRemove,
}: CarouselItemProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative transition-all duration-200"
      onClick={onClick}
    >
      <div className="relative w-32 h-24 mx-auto cursor-pointer group">
        <Image
          src={image.url}
          alt={image.title}
          width={128}
          height={96}
          className="object-cover rounded-lg shadow-md"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Image number badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-b-lg flex justify-between items-center">
          <span>{position}</span>
          <button
            onClick={onRemove}
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
    </motion.div>
  );
}
