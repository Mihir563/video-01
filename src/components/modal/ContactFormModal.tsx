// components/modal/ContactFormModal.tsx
"use client";

import { useState } from "react";
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

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: string[];
}

export default function ContactFormModal({
  isOpen,
  onClose,
  selectedImages,
}: ContactFormModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      email: "",
    },
  });

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
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] p-0 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-zinc-900/70
"
      >
        {!isSubmitted ? (
          <div className="p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl sm:text-2xl font-bold bg dark:text-blue-500">
                Complete Your Video Request
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Please provide your contact details to receive your video.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-2 "
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          className=" dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your WhatsApp number"
                          className=" dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          className=" dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-md font-medium text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 py-12">
            <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 dark:text-gray-50">
              Request Submitted!
            </h3>
            <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
              You will receive your video shortly on your WhatsApp and email.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
