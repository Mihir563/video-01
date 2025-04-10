"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"; // 👈 shadcn-compatible hook
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const {setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="p-2 rounded-full bg-gray-200/20 hover:bg-gray-200/30 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "light" ? (
        <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}
