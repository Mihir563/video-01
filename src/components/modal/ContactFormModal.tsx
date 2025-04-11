// components/modal/ContactFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, User, X } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { ProjectImage } from "@/types/projects";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsapp: z
    .string()
    .min(10, { message: "Please enter a valid WhatsApp number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

interface selectedImagesProps {
  id: string;
  index: number;
  title: string;
  url: string;
}

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: string[];
  images: selectedImagesProps[];
  template: string | undefined;
}

export default function ContactFormModal({
  isOpen,
  onClose,
  selectedImages,
  images,
  template
}: ContactFormModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImageObjects, setSelectedImageObjects] = useState<
    selectedImagesProps[] | null
  >([]);
  console.log(selectedImageObjects);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      email: "",
    },
  });


  useEffect(() => {
    // Get selected images and ensure they have valid URLs
    const selected = selectedImages
      .map((id) => {
        const img = images.find((img) => img.id === id);
        if (!img) return undefined;
        
        // Create a copy of the image with a processed URL
        return {
          ...img,
          // If URL is relative, make it absolute (this helps with image display)
          url: img.url.startsWith('/') 
            ? `${window.location.origin}${img.url}` 
            : img.url
        };
      })
      .filter((img): img is selectedImagesProps => img !== undefined);

    console.log({ selected: selected });
    setSelectedImageObjects(selected);
  }, [selectedImages, images]);

  const onSubmit = (data: FormValues) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted with data:", data);
    console.log("Selected images:", selectedImages);

    // Create a project object with all necessary data
    const projectData = {
      id: `proj_${Date.now()}`, // Generate a unique ID based on timestamp
      createdAt: new Date().toISOString(),
      images: selectedImageObjects || [],
      template: template,
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      status: 'pending', // Initial status is pending
    };

    console.log({ projectData });
    
    // Save to localStorage
    try {
      // Get existing projects or initialize empty array
      const existingProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      
      // Add new project to the beginning of the array
      existingProjects.unshift(projectData);
      
      // Save back to localStorage
      localStorage.setItem('userProjects', JSON.stringify(existingProjects));
      console.log('Project saved successfully');
      
      // Simulate processing workflow with status changes
      // Change to processing after 3 seconds
      setTimeout(() => {
        const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
        const projectIndex = projects.findIndex((p: ProjectImage) => p.id === projectData.id);
        
        if (projectIndex !== -1) {
          projects[projectIndex].status = 'processing';
          localStorage.setItem('userProjects', JSON.stringify(projects));
          console.log('Project status updated to processing');
          
          // Change to completed after another 5 seconds
          setTimeout(() => {
            const updatedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
            const updatedIndex = updatedProjects.findIndex((p: ProjectImage) => p.id === projectData.id);
            
            if (updatedIndex !== -1) {
              updatedProjects[updatedIndex].status = 'completed';
              localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
              console.log('Project status updated to completed');
            }
          }, 5000);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error saving project to localStorage:', error);
    }
    
    // Show success message
    setIsSubmitted(true);

    // Reset form after submission
    form.reset();

    // Close the modal after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 10000);
  };


 

  return (
    <Dialog open={isOpen} >
      <DialogContent className="sm:max-w-[500px] rounded-2xl border border-white/10 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6">
        {!isSubmitted ? (
          <div className="p-8">
            <DialogClose asChild>
              <button
                onClick={() =>onClose()}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogClose>

            <DialogHeader className="pb-6 text-center">
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-300 to-zinc-400 text-transparent bg-clip-text">
                Final Step: Get Your Video
              </DialogTitle>
              <DialogDescription className="text-gray-700 dark:text-gray-400 mt-2">
                We will need your contact details to send you the video.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-6"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                            <User className="w-5 h-5" />
                          </span>
                          <Input
                            placeholder="Elon Musk"
                            className="pl-10 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WhatsApp */}
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500">
                            {/* WhatsApp SVG */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="w-5 h-5"
                            >
                              <path d="M20.52 3.48A11.84 11.84 0 0012 0C5.37 0 .05 5.32.05 11.89a11.9 11.9 0 001.62 6.02L0 24l6.29-1.64a11.9 11.9 0 005.71 1.45h.01c6.62 0 11.94-5.32 11.94-11.89a11.8 11.8 0 00-3.43-8.44zm-8.52 18.3a9.84 9.84 0 01-5.02-1.35l-.36-.22-3.74.97.99-3.64-.24-.37a9.9 9.9 0 01-1.57-5.38c0-5.45 4.45-9.88 9.93-9.88a9.83 9.83 0 016.97 2.89 9.8 9.8 0 012.87 6.98c0 5.45-4.44 9.88-9.93 9.88zm5.56-7.42c-.3-.15-1.75-.86-2.02-.95s-.47-.15-.67.15c-.2.3-.77.95-.95 1.14-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.52-.08-.15-.67-1.6-.92-2.2-.25-.6-.5-.52-.67-.52h-.57c-.2 0-.52.07-.8.35s-1.05 1.02-1.05 2.5c0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.15 4.52.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.41.25-.68.25-1.26.17-1.41-.08-.15-.27-.23-.57-.38z" />
                            </svg>
                          </span>
                          <Input
                            placeholder="+91 98765 43210"
                            className="pl-10  dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                            <Mail className="w-5 h-5" />
                          </span>
                          <Input
                            placeholder="you@example.com"
                            className="pl-10 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg rounded-xl font-semibold text-white bg-blue-500  hover:bg-blue-600 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  >
                    Submit & Generate
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in-95">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Request Received!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-sm">
              You’ll get your video via WhatsApp or email shortly.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
