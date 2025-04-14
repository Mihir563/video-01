"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/project/projectCard";
import ProjectDialog from "@/components/project/ProjectDialog";
import EmptyProjectsState from "@/components/project/emptyProjectState";
import LoadingState from "@/components/project/loading";
import { formatDate } from "@/utils/date";
import { Project } from "@/types/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewProject, setViewProject] = useState<Project | null>(null);

  // Fetch projects from localStorage
  useEffect(() => {
    const fetchProjects = () => {
      setLoading(true);
      try {
        // Get projects from localStorage
        const savedProjects = localStorage.getItem("userProjects");

        if (savedProjects) {
          const parsedProjects: Project[] = JSON.parse(savedProjects);
          setProjects(parsedProjects);
        } else {
          // No projects found in localStorage
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects from localStorage:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchProjects();

    // Set up event listener for storage changes (in case projects are added from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userProjects") {
        fetchProjects();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in mt-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
        Your Projects
      </h1>

      {loading ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={setViewProject}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* View Project Modal */}
      <ProjectDialog
        project={viewProject}
        onClose={() => setViewProject(null)}
      />

      
    </div>
  );
}
