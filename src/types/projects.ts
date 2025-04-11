export interface ProjectImage {
    id: string;
    index: number;
    title: string;
    url: string;
  }
  
  export interface Project {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    whatsapp: string;
    template: string;
    images: ProjectImage[];
    status?: 'pending' | 'processing' | 'completed' | 'failed';
  }