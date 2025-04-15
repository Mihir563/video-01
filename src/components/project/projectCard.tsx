"use client";

import { Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects";
import { OrderStatusBadge } from "./orderStatusBadge";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  formatDate: (dateString: string) => string;
  onWatchVideo?: (project: Project) => void;
}

export default function ProjectCard({ 
  project, 
  onView, 
  formatDate,
  onWatchVideo 
}: ProjectCardProps) {
  // Ensure we have selectedImages as an array
  const selectedImages = project.selectedImages || [];
  
  return (
    <div className="grid-item rounded-xl overflow-hidden border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {selectedImages.length > 0 ? (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-t from-background/80 to-transparent absolute z-10"></div>
              {/* Display the actual image or fallback to a gradient */}
              {selectedImages[0] ? (
                <div className="w-full h-full">
                  <Image
                    width={100} 
                    height={100}
                    src={selectedImages[0]} 
                    alt={`Project ${project.id} image`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with a gradient background
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = 'w-full h-full bg-gradient-to-br from-accent/20 to-primary/20';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20"></div>
              )}
            </div>
            <div className="absolute bottom-3 left-3 z-20 bg-blue-600/60 text-white/60 text-xs font-bold px-1 py-1 rounded-md ">
              <span className="bg-background/70 text-foreground text-xs px-2 py-1 rounded-full">
                #{selectedImages.length} images
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-muted-foreground text-sm">No images</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-card-foreground truncate">{project.title || `Project ${project.id}`}</h3>
          <span className="text-xs text-muted-foreground">{formatDate(project.createdOn || '')}</span>
        </div>
        
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {`Template ${project.templateId}` || 'Custom'}
          </span>
          
          {/* Order Status Badge */}
          <OrderStatusBadge status={project.isOrderDone || 'undefined'} />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1 cursor-pointer backdrop-blur-2xl"
            onClick={() => onView(project)}
          >
            <Eye className="w-3 h-3" />
            View Details
          </Button>
          
          {/* Show Watch Video button if video is available (isOrderDone is "Y") */}
          {project.isOrderDone === "Y" && project.videoUrl && (
            <Button 
              size="sm" 
              className="text-xs flex items-center gap-1 bg-blue-400 hover:bg-blue-500 cursor-pointer"
              onClick={() => onWatchVideo && onWatchVideo(project)}
            >
              <Play className="w-3 h-3" />
              Watch Video
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}