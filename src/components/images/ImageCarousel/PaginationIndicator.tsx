// components/images/ImageCarousel/PaginationIndicator.tsx
import React from "react";

interface PaginationIndicatorProps {
  totalItems: number;
  itemsPerPage: number;
  currentIndex: number;
  onPageChange: (index: number) => void;
}

export default function PaginationIndicator({
  totalItems,
  itemsPerPage,
  currentIndex,
  onPageChange,
}: PaginationIndicatorProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage);

  if (totalItems <= itemsPerPage) {
    return null; // Don't show pagination if all items fit on one page
  }

  return (
    <div className="flex justify-center mt-3 gap-1">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i * itemsPerPage)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentPage === i
              ? "bg-blue-600 scale-125"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
}
