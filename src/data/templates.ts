// data/templates.ts

import { Template } from "@/types"

export const templates: Template[] = [
  {
    id: "slide-show",
    title: "Slideshow",
    description: "Elegant transitions with smooth fade effects",
    url:"/assets/first.mp4",
    thumbnail: "/thumbnails/fade-template.jpg",
    bestFor: "professional presentations and portfolios",
    tags: ["Professional", "Elegant", "Minimal"],
    effect: "fade"
  },
  {
    id: "zoom-out",
    title: "Zoom out",
    description: "Engaging zoom effects that bring focus to your images",
    url:"/assets/second.mp4",
    thumbnail: "/thumbnails/zoom-template.jpg",
    bestFor: "product showcases and travel highlights",
    tags: ["Dynamic", "Engaging", "Modern"],
    effect: "zoom"
  },
  {
    id: "smooth-slide",
    title: "Smooth Slide",
    description: "Fluid slide transitions for an impressive presentation",
    url:"/assets/video.mp4",
    thumbnail: "/thumbnails/slide-template.jpg",
    bestFor: "storytelling and sequential content",
    tags: ["Smooth", "Fluid", "Clean"],
    effect: "slide"
  },
  {
    id: "kenburns",
    title: "Ken Burns Effect",
    description: "Classic pan and zoom effects for a cinematic feel",
    url:"/assets/video.mp4",
    thumbnail: "/thumbnails/kenburns-template.jpg",
    bestFor: "documentary style and nostalgic content",
    tags: ["Cinematic", "Classic", "Dramatic"],
    effect: "kenburns"
  }
]