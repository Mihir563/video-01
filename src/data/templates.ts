// data/templates.ts

import { Template } from "@/types"

// Default templates as fallback

// Function to map API response to UI-compatible format
const mapApiTemplateToUI = (template: Template): Template => {
  return {
    ...template,
    id: template.template_id,
    title: template.name,
    description: `${template.name} template with ${template.required_images} required images`,
    url: "/assets/video.mp4", // Default video URL
    thumbnail: template.thumb_url || `/placeholder.png`,
    bestFor: "creating stunning videos",
    tags: ["Professional", "Modern", "Creative"],
    effect: template.folder_prefix.split('_')[1]?.toLowerCase() || "fade"
  };
};

// Function to fetch templates from API
export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const response = await fetch('https://studio.codnix.com/creation/services/getTemplates');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "1" && Array.isArray(data.data)) {
      return data.data.map(mapApiTemplateToUI);
    } else {
      console.error("Invalid API response format", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

// Export static templates for SSR/fallback
export const templates: Template[] = [];