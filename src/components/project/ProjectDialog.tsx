"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/projects";
import Image from "next/image";
import { Play, RefreshCw } from "lucide-react";
import { useState, Fragment } from "react";
import VideoPlayerModal from "../modal/VideoPlayerModal";
import { OrderStatusBadge } from "./orderStatusBadge";
import axios from "axios";
import { toast } from "sonner";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  onProjectUpdate?: (updatedProject: Project) => void;
}

export default function ProjectDialog({ project, onClose, onProjectUpdate }: ProjectDialogProps) {
  
  // Function to retry failed orders
  const [retrying, setRetrying] = useState(false);
  // State for video player modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  if (!project) return null;
  
  
  // Extract selectedImages from project (from API) or use empty array if undefined
  const selectedImages = project.selectedImages || [];
  
  const statusDotClasses: Record<string, string> = {
    'Y': 'bg-green-500',         // Complete
    'N': 'bg-yellow-500',        // Pending
    'P': 'bg-blue-500',          // Processing
    'E': 'bg-red-500',           // Error
    'undefined': 'bg-gray-500'   // Unknown/Default
  };
  
  // Function to open video player modal
  const handleWatchVideo = () => {
    if (project.videoUrl) {
      setVideoModalOpen(true);
    }
  };
  
  
  const handleRetry = async () => {
    if (!project) return;
    
    try {
      setRetrying(true);
      
      // Create payload for API
      const formData = new FormData();
      formData.append("template_id", project.templateId?.toString() || "1");
      formData.append("album_code", project.albumCode || "");
      formData.append("photobook_id", project.photobookId || "");
      formData.append("user_name", project.userName || project.name || "");
      formData.append("user_email", project.userEmail || project.email || "");
      formData.append("user_phone", project.userPhone || project.whatsapp || "");
      
      // Add selected images
      const imageUrls = project.selectedImages || [];
      formData.append("selected_images", JSON.stringify(imageUrls));
      
      // Send data to API using axios
      const response = await axios.post(
        "https://studio.codnix.com/creation/services/saveTemplateOrder",
        formData
      );
      
      if (response.data.status === "1" || response.data.status === 1) {
        toast.success("Order resubmitted successfully");
        
        // Update the project status
        if (onProjectUpdate && project) {
          const updatedProject = {
            ...project,
            isOrderDone: "N" // Set to pending
          };
          onProjectUpdate(updatedProject);
        }
        
        // Close the dialog
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to resubmit order");
      }
    } catch (error) {
      console.error("Error resubmitting order:", error);
      toast.error("Failed to resubmit order. Please try again.");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Fragment>
      <Dialog open={!!project} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border  bg-primary backdrop-blur-xl shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">
              Video Details
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Project Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Name
                  </h4>
                  <p className="text-accent">
                    {project.title || `Project ${project.id}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Template
                  </h4>
                  <p className="text-accent">
                    {`Template ${project.templateId}` || "Custom"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h4>
                  <p className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        statusDotClasses[project.isOrderDone] ||
                        statusDotClasses["undefined"]
                      }`}
                    ></span>
                    <span className="text-accent">
                      <OrderStatusBadge
                        status={project.isOrderDone || "undefined"}
                      />
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium break-words whitespace-normal text-muted-foreground">
                    Email
                  </h4>
                  <p className="text-accent break-words whitespace-normal">
                    {project.userEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h4>
                  <p className="text-accent">{project.userPhone || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Created On
                  </h4>
                  <p className="text-accent">{project.createdOn || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Selected Images
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedImages.length > 0 ? (
                  selectedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden border border-border"
                    >
                      {/* Display the actual image or fallback to a gradient */}
                      {imageUrl ? (
                        <div className="w-full h-full">
                          <Image
                            height={100}
                            width={100}
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, replace with a gradient background
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.parentElement!.className =
                                "w-full h-full bg-gradient-to-br from-accent/20 to-primary/20";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20"></div>
                      )}
                      <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded truncate">
                        Image {index + 1}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-muted-foreground">
                    No images available
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <div className="flex gap-2">
                {/* Show Watch Video button if video is available (isOrderDone is "Y") */}
                {project.isOrderDone === "Y" && project.videoUrl && (
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    onClick={handleWatchVideo}
                  >
                    <Play className="h-4 w-4" />
                    Watch Video
                  </Button>
                )}

                {/* Show Retry button if order has failed (isOrderDone is "E") */}
                {project.isOrderDone === "E" && (
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600"
                    onClick={handleRetry}
                    disabled={retrying}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
                    />
                    {retrying ? "Retrying..." : "Retry Order"}
                  </Button>
                )}
              </div>

              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      {videoModalOpen && project.videoUrl && (
        <VideoPlayerModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={project.videoUrl}
          title={project.title || `Project ${project.id}`}
        />
      )}
    </Fragment>
  );
}