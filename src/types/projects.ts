export interface ProjectImage {
    id: string;
    index: number;
    title: string;
    url: string;
  }
  
  export interface Project {
    isOrderDone: string;
    selectedImages: never[];
    title: string;
    templateId: number | string | null;
    userEmail: string;
    userPhone: string;
    createdOn: string;
    id: string;
    createdAt: string;
    name: string;
    email: string;
    whatsapp: string;
    template: string;
    images: ProjectImage[];
    status?: 'pending' | 'processing' | 'completed' | 'failed' | undefined;
    videoUrl?: string | null;
    albumCode?: string;
    photobookId?: string;
    userName?: string;
    orderDoneOn?: string | null;
  }