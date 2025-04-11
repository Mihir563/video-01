import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/projects";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  if (!project) return null;
  
  const statusDotClasses = {
    'pending': 'bg-yellow-500',
    'processing': 'bg-blue-500',
    'completed': 'bg-green-500',
    'failed': 'bg-red-500',
    'undefined': 'bg-gray-500'
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Project Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p className="text-gray-200">{project.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Template</h4>
                <p className="text-gray-200">{project.template || 'Custom'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${statusDotClasses[project.status || 'undefined']}`}></span>
                  <span className="text-gray-200">
                    {project.status ? (
                      project.status.charAt(0).toUpperCase() + project.status.slice(1)
                    ) : (
                      'Unknown'
                    )}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p className="text-gray-200">{project.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">WhatsApp</h4>
                <p className="text-gray-200">{project.whatsapp}</p>
              </div>
            </div>
          </div>
          
          {/* Project Images */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Selected Images</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.images.map((image) => (
                <div key={image.id} className="relative aspect-video rounded-md overflow-hidden border border-border">
                  {/* Display the actual image or fallback to a gradient */}
                  {image.url ? (
                    <div className="w-full h-full">
                      <img 
                        src={image.url} 
                        alt={image.title || 'Project image'}
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
                  <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs p-1 rounded truncate">
                    {image.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
