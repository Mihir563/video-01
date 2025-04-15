"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-24">
      <motion.div 
        className="max-w-md w-full space-y-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <motion.h1 
            className="text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            404
          </motion.h1>
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            variants={itemVariants}
          >
            Page Not Found
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mt-4"
            variants={itemVariants}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          <motion.div 
            className="mt-6"
            variants={itemVariants}
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to home in {count} seconds...
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center gap-2 w-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href="/" passHref>
              <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 w-full">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
