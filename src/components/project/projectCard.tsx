"use client";

import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects";
import { StatusBadge } from "./statusbedge";

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function ProjectCard({ 
  project, 
  onView, 
  onDelete, 
  formatDate 
}: ProjectCardProps) {
  return (
    <div className="grid-item rounded-xl overflow-hidden border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.images.length > 0 ? (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-t from-background/80 to-transparent absolute z-10"></div>
              {/* Display the actual image or fallback to a gradient */}
              {project.images[0].url ? (
                <div className="w-full h-full">
                  <img 
                    src={project.images[0].url} 
                    alt={project.images[0].title || 'Project image'}
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
            <div className="absolute bottom-3 left-3 z-20  bg-blue-600/60 text-white/60 text-xs font-bold px-1 py-1 rounded-md ">
              <span className="bg-background/70 text-foreground text-xs px-2 py-1 rounded-full">
                #{project.images.length} images
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
          <h3 className="font-semibold text-lg text-card-foreground truncate">{project.name}</h3>
          <span className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</span>
        </div>
        
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {project.template || 'Custom'}
          </span>
          
          {/* Status Badge */}
          {project.status && (
            <StatusBadge status={project.status} />
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => onView(project)}
          >
            <Eye className="w-3 h-3" />
            View Details
          </Button>
          
          <Button 
          variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}