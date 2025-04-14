// types/index.ts

export interface Template {
  template_id: string;
  name: string;
  folder_prefix: string;
  required_images: number | null;
  gif_url: string | null;
  thumb_url: string | null;
  status: string;
  createdon: string;
  // Additional fields for UI compatibility
  id?: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  bestFor?: string;
  tags?: string[];
  effect?: string;
}

  //  "template_id": "3",
  //     "name": "Template3",
  //     "folder_prefix": "003_WEDDING",
  //     "thumb_url": null,
  //     "required_images": "2",
  //     "status": "Y",
  //     "createdon": "2025-04-14 06:22:17"
  //   }

export interface UserImage {
  id: string
  url: string
  title: string
  index:number
}