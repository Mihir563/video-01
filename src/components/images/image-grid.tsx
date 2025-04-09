"use client"

import Image from "next/image"
import type { UserImage } from "@/types"

interface ImageGridProps {
  images: UserImage[]
  loading: boolean
  selectedImages: string[]
  showIndexNumbers:boolean
  onSelectImage: (imageId: string) => void
}

export default function ImageGrid({ images, loading, selectedImages, onSelectImage }: ImageGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600 dark:text-gray-400">No images found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div key={image.id} className="grid-item">
          <div
            className={`
              relative rounded-xl overflow-hidden group cursor-pointer bg-white dark:bg-gray-900
              ${selectedImages.includes(image.id) ? "ring-2 ring-green-500" : ""}
            `}
            onClick={() => onSelectImage(image.id)}
          >
            <div className="aspect-[4/3] relative">
              <Image 
                src={image.url || "/placeholder.svg"} 
                alt={image.title} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover" 
              />

              <div
                className={`
                absolute inset-0 bg-black/40 flex items-center justify-center
                ${selectedImages.includes(image.id) ? "opacity-60" : "opacity-0 group-hover:opacity-40"}
                transition-opacity duration-300
              `}
              />

              <div className="absolute top-3 right-8 z-10">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => onSelectImage(image.id)}
                  />
                  <span className="checkbox-custom"></span>
                </label>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm font-medium truncate text-gray-900 dark:text-white">{image.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}