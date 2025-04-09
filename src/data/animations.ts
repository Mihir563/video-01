// src/data/animations.ts
export interface Animation {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  ffmpegFilter: string;
}

export const animations: Animation[] = [
  {
    id: "fade",
    title: "Smooth Fade",
    description: "Elegant fade transition between images",
    thumbnail: "/thumbnails/animation-fade.jpg",
    ffmpegFilter: "[scaled]split[scaled1][scaled2];[scaled1][scaled2]xfade=transition=fade:duration=1:offset={duration}[outv]"
  },
  {
    id: "zoom",
    title: "Ken Burns Zoom",
    description: "Gentle zoom effect that brings images to life",
    thumbnail: "/thumbnails/animation-zoom.jpg",
    ffmpegFilter: "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,zoompan=z='if(lte(zoom,1.0),1.2,max(1.001,zoom-0.001))':d={frames}:s=1280x720:fps=25[outv]"
  },
  {
    id: "slide",
    title: "Slide Effect",
    description: "Images slide across the screen for dynamic presentation",
    thumbnail: "/thumbnails/animation-slide.jpg",
    ffmpegFilter: "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,xfade=transition=slideleft:duration=1:offset={duration}[outv]"
  },
  {
    id: "rotate",
    title: "Gentle Rotation",
    description: "Subtle rotation effect with smooth transitions",
    thumbnail: "/thumbnails/animation-rotate.jpg",
    ffmpegFilter: "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,rotate=angle='0.02*sin(2*PI*t/10)':fillcolor=black[outv]"
  },
  {
    id: "pixelize",
    title: "Pixel Transition",
    description: "Modern pixel dissolve effect between images",
    thumbnail: "/thumbnails/animation-pixelize.jpg",
    ffmpegFilter: "[scaled]split[scaled1][scaled2];[scaled1][scaled2]xfade=transition=pixelize:duration=1:offset={duration}[outv]"
  }
];