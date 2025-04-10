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
import { CheckCircle } from "lucide-react";

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
}

export default function ContactFormModal({
  isOpen,
  onClose,
  selectedImages,
  images,
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
    const selected = selectedImages
      .map((id) => images.find((img) => img.id === id))
      .filter((img): img is selectedImagesProps => img !== undefined); // <- this tells TS that img is definitely of type `selectedImagesProps`

    console.log({ selected: selected });

    setSelectedImageObjects(selected);
  }, [selectedImages, images]);

  const onSubmit = (data: FormValues) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted with data:", data);
    console.log("Selected images:", selectedImages);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border border-white/10 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6">
        {!isSubmitted ? (
          <div className="p-8">
            <DialogHeader className="pb-6 text-center">
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                Final Step: Get Your Video
              </DialogTitle>
              <DialogDescription className="text-gray-700 dark:text-gray-400 mt-2">
                We need your contact details.
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
                        <Input
                          placeholder="Elon Musk"
                          className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                          {...field}
                        />
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
                        <Input
                          placeholder="+91 98765 43210"
                          className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none rounded-md"
                          {...field}
                        />
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
                        <Input
                          placeholder="you@example.com"
                          className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
