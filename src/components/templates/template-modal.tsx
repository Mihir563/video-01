"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Template } from "@/types"

interface TemplateModalProps {
  template: Template
  isOpen: boolean
  onClose: () => void
}

export default function TemplateModal({ template, isOpen, onClose }: TemplateModalProps) {
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"

      // Animate in
      if (overlayRef.current) overlayRef.current.classList.add("open")
      if (contentRef.current) contentRef.current.classList.add("open")
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  const handleClose = () => {
    // Animate out
    if (overlayRef.current) overlayRef.current.classList.remove("open")
    if (contentRef.current) contentRef.current.classList.remove("open")

    // Delay actual closing to allow animation to complete
    setTimeout(onClose, 300)
  }

  const handleSelectTemplate = () => {
    handleClose()
    // Navigate to image selection page with the selected template
    router.push(`/select-images/${template.id}`)
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="modal-content relative bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          onClick={handleClose}
        >
          ✕
        </button>

        <div className="aspect-video relative">
          <video
            src={template.url}
            poster={template.thumbnail}
            className="w-full h-full object-cover"
            controls
            autoPlay
            loop
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{template.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{template.description}</p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSelectTemplate}
              className="px-6 py-3 rounded-lg  bg-blue-500 font-medium  hover:bg-blue-400 transition-colors duration-300 flex-1 text-white"
            >
              Select Template
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 flex-1 text-gray-900 dark:text-white"
            >
              Browse More Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

