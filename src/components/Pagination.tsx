import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: React.ReactNode[] = [];
    const maxVisiblePages = 5;

    // For few pages, show all page numbers
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === i
                ? "bg-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-blue-400"
            }`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
      }
      return pageNumbers;
    }

    // For many pages, show with ellipsis
    const pushPageNumber = (i: number) => {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            currentPage === i
              ? "bg-blue-600 "
              : " hover:bg-gray-100  dark:hover:bg-gray-700"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    };

    const pushEllipsis = (key: string) => {
      pageNumbers.push(
        <span
          key={key}
          className="w-8 h-8 flex items-center justify-center text-gray-500"
          aria-hidden="true"
        >
          &hellip;
        </span>
      );
    };

    // Always include first page
    pushPageNumber(1);

    // Add ellipsis after first page if needed
    if (currentPage > 3) {
      pushEllipsis("ellipsis-1");
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pushPageNumber(i);
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      pushEllipsis("ellipsis-2");
    }

    // Always include last page if not the first page
    if (totalPages > 1) {
      pushPageNumber(totalPages);
    }

    return pageNumbers
  };

  return (
    <nav
      className="flex items-center justify-end mt-8 gap-2"
      aria-label="Pagination"
    >
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-2">{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
