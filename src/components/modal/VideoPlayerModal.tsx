"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title 
}: VideoPlayerModalProps) {
  
  // Function to handle video download
const handleDownload = () => {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // For mobile devices, open in new window
    window.open(videoUrl, "_blank");
  } else {
    // Original desktop approach
    try {
      fetch(videoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title.replace(/\s+/g, "_")}.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.error("Download failed:", err);
          // Fallback to direct link
          window.open(videoUrl, "_blank");
        });
    } catch (error) {
      console.error("Download attempt failed:", error);
      // Fallback to direct link
      window.open(videoUrl, "_blank");
    }
  }
};
  // Function to handle video sharing
  const handleShare = () => {
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: title,
        text: '',
        url: videoUrl,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      // Copy the URL to clipboard
      navigator.clipboard.writeText(videoUrl)
        .then(() => {
          alert('Video URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-2xl border border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="p-6 pb-0 flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Video Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              src={videoUrl}
              controls
              className="w-full h-full"
              autoPlay={true}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
