"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import ProjectCard from "@/components/project/projectCard";
import ProjectDialog from "@/components/project/ProjectDialog";
import EmptyProjectsState from "@/components/project/emptyProjectState";
import LoadingState from "@/components/project/loading";
import { formatDate } from "@/utils/date";
import { Project } from "@/types/projects";
import { useSearchParams } from "next/navigation";
import VideoPlayerModal from "@/components/modal/VideoPlayerModal";
import Pagination from "@/components/Pagination";


type RawItem = {
  order_id: number;
  template_id: string;
  album_code: string;
  photobook_id: string;
  selected_images: string; // JSON string
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  createdon?: string;
  status?: string;
  is_order_done?: string;
  order_done_on?: string | null;
  video_url?: string | null;
};


function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [videoProject, setVideoProject] = useState<Project | null>(null);
  const searchParams = useSearchParams();
  const albumCode = searchParams.get("c");
  
  // Function to handle project updates (e.g., after a retry)
  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    
    // Also update the viewProject if it's the same one
    if (viewProject?.id === updatedProject.id) {
      setViewProject(updatedProject);
    }
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (!albumCode) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("album_code", albumCode);

        const response = await axios.post(
          "https://studio.codnix.com/creation/services/getVideoOrders",
          formData
        );

        if (response.data.status === "1") {
          // Map API response to the Project type structure
          const apiProjects = response.data.data.map((item: RawItem) => {
            // Ensure selectedImages is an array even if parsing fails
            let selectedImages = [];
            try {
              if (item.selected_images) {
                selectedImages = JSON.parse(item.selected_images);
              }
            } catch (error) {
              console.error("Error parsing selected images:", error);
              // If parsing fails, provide an empty array
              selectedImages = [];
            }
            
            return {
              id: item.order_id,
              title: `Video ${item.order_id}`,
              templateId: item.template_id,
              albumCode: item.album_code,
              photobookId: item.photobook_id,
              selectedImages: selectedImages, // Use the safely parsed or default empty array
              userName: item.user_name || "",
              userEmail: item.user_email || "",
              userPhone: item.user_phone || "",
              createdOn: item.createdon || "",
              status: item.status || "",
              isOrderDone: item.is_order_done || "N",
              orderDoneOn: item.order_done_on || null,
              videoUrl: item.video_url || null
            };
          });
          
          setProjects(apiProjects);
        } else {
          // API returned error or no data
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects from API:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [albumCode]);

  console.log(projects);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalcount = projects.length;
  console.log(totalcount)

  // Calculate paginated projects
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in mt-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Your Videos
      </h1>

      {loading ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div>
          <Pagination
            currentPage={currentPage}
            totalItems={projects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
          <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={setViewProject}
                formatDate={formatDate}
                onWatchVideo={setVideoProject}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={totalcount}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* View Project Modal */}
      <ProjectDialog
        project={viewProject}
        onClose={() => setViewProject(null)}
        onProjectUpdate={handleProjectUpdate}
      />

      {/* Video Player Modal */}
      {videoProject && videoProject.videoUrl && (
        <VideoPlayerModal
          isOpen={!!videoProject}
          onClose={() => setVideoProject(null)}
          videoUrl={videoProject.videoUrl}
          title={videoProject.title || `Video ${videoProject.id}`}
        />
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProjectsContent />
    </Suspense>
  );
}