"use client"

import Image from "next/image"
import type { UserImage } from "@/types"
import { Checkbox } from "../ui/checkbox"

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
        <div className="animate-spin w-12 h-12 border-4 border-ring border-t-transparent rounded-full" />
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-10">
      {images.map((image) => (
        <div key={image.id} className="grid-item">
          <div
            className={`
              relative rounded-xl overflow-hidden group cursor-pointer bg-white dark:bg-gray-900
              ${selectedImages.includes(image.id) ? "ring-3 ring-blue-500  " : ""}
            `}
            onClick={() => onSelectImage(image.id)}
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover active:scale-105 transition-all duration-300"
              />
              {image.index && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  #{image.index}
                </div>
              )}
              <div className="absolute top-2 right-3 z-10">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => onSelectImage(image.id)}
                  />
                  <Checkbox
                    checked={selectedImages.includes(image.id)}
                    onChange={() => onSelectImage(image.id)}
                    className="h-6 w-6 rounded-md border-2 border-green-600 bg-transparent text-white ring-offset-background transition-all duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}