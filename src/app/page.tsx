"use client";

import { useEffect, useState } from "react";
import TemplateGrid from "@/components/templates/template-grid";
import { templates as fallbackTemplates, fetchTemplates } from "@/data/templates";
import { Template } from "@/types";
import LoadingState from "@/components/project/loading";

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>(fallbackTemplates);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getTemplates = async () => {
      try {
        const apiTemplates = await fetchTemplates();
        setTemplates(apiTemplates);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        // Fallback to default templates
      } finally {
        setLoading(false);
      }
    };

    getTemplates();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 pt-32 ">
      <section className="mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] animate-gradient-x">
          Select Your Video Template
        </h1>

        <p className="text-lg md:text-xl text-accent max-w-3xl">
          Choose from our premium collection of video templates to create
          stunning videos with your images.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingState />
        </div>
      ) : templates.length > 0 ? (
        <TemplateGrid templates={templates} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No templates found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We couldn't find any templates to display. Please check back later or contact support if the issue persists.
          </p>
        </div>
      )}
    </div>
  );
}