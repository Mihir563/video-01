"use client";

import { useState, useEffect } from "react";
import { Trash2, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface ProjectImage {
  id: string;
  index: number;
  title: string;
  url: string;
}

interface Project {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  whatsapp: string;
  template: string;
  images: ProjectImage[];
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Fetch projects from localStorage
  useEffect(() => {
    const fetchProjects = () => {
      setLoading(true);
      try {
        // Get projects from localStorage
        const savedProjects = localStorage.getItem('userProjects');
        
        if (savedProjects) {
          const parsedProjects: Project[] = JSON.parse(savedProjects);
          setProjects(parsedProjects);
        } else {
          // No projects found in localStorage
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects from localStorage:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchProjects();

    // Set up event listener for storage changes (in case projects are added from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProjects') {
        fetchProjects();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleDeleteProject = (id: string) => {
    try {
      // Filter out the project to be deleted
      const updatedProjects = projects.filter(project => project.id !== id);
      
      // Update state
      setProjects(updatedProjects);
      
      // Update localStorage
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
      
      // Close the confirmation dialog
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in mt-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Your Projects
      </h1>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="grid-item p-8 rounded-xl text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="w-16 h-16 text-muted mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-6">You haven't created any projects yet.</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => window.location.href = '/'}
            >
              Create Your First Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="grid-item rounded-xl overflow-hidden border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {project.images.length > 0 ? (
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent absolute z-10"></div>
                      {/* Display the actual image or fallback to a gradient */}
                      {project.images[0].url ? (
                        <div className="w-full h-full">
                          <Image 
                            height={100}
                            width={100}
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
                    <div className="absolute bottom-3 left-3 z-20 flex items-center">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {project.images.length} {project.images.length === 1 ? 'image' : 'images'}
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
                  <h3 className="font-semibold text-lg text-gray-200 truncate">{project.name}</h3>
                  <span className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</span>
                </div>
                
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {project.template || 'Custom'}
                  </span>
                  
                  {/* Status Badge */}
                  {project.status && (
                    <span 
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${{
                        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                        'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 animate-pulse',
                        'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                        'failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }[project.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${{
                        'pending': 'bg-yellow-500',
                        'processing': 'bg-blue-500',
                        'completed': 'bg-green-500',
                        'failed': 'bg-red-500'
                      }[project.status]}`}></span>
                      {project.status === 'pending' && 'Pending'}
                      {project.status === 'processing' && 'Processing'}
                      {project.status === 'completed' && 'Completed'}
                      {project.status === 'failed' && 'Failed'}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs flex items-center gap-1"
                    onClick={() => setViewProject(project)}
                  >
                    <Eye className="w-3 h-3" />
                    View Details
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs flex items-center gap-1"
                    onClick={() => setDeleteConfirm(project.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View Project Modal */}
      {viewProject && (
        <Dialog open={!!viewProject} onOpenChange={() => setViewProject(null)}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold ">
                Project Details
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6 space-y-6">
              {/* Project Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p className="text-gray-200">{viewProject.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Template</h4>
                    <p className="text-gray-200">{viewProject.template || 'Custom'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${{
                        'pending': 'bg-yellow-500',
                        'processing': 'bg-blue-500',
                        'completed': 'bg-green-500',
                        'failed': 'bg-red-500',
                        'undefined': 'bg-gray-500'
                      }[viewProject.status || 'undefined']}`}></span>
                      <span className="text-gray-200">
                        {viewProject.status ? (
                          viewProject.status.charAt(0).toUpperCase() + viewProject.status.slice(1)
                        ) : (
                          'Unknown'
                        )}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="text-gray-200">{viewProject.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">WhatsApp</h4>
                    <p className="text-gray-200">{viewProject.whatsapp}</p>
                  </div>
                </div>
              </div>
              
              {/* Project Images */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Selected Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {viewProject.images.map((image) => (
                    <div key={image.id} className="relative aspect-video rounded-md overflow-hidden border border-border">
                      {/* Display the actual image or fallback to a gradient */}
                      {image.url ? (
                        <div className="w-full h-full">
                          <Image
                            height={100}
                            width={100}
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
                  onClick={() => setViewProject(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl border border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-destructive">
                Delete Project
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-200 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteProject(deleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
