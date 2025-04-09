import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/contexts/theme-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Template Platform",
  description: "Select and customize video templates with your images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 to-black`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
