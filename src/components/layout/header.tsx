"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Image from "next/image"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 
        ${
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-3"
            : "bg-transparent py-5"
        }
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
        >
          <Image
            height={100}
            width={100}
            alt="ealbum"
            src={
              "https://ealbum.in/wp-content/uploads/2019/07/ealbum-Logo-_-light.png"
            }
          />
        </Link>

        <nav className="hidden md:flex space-x-8">
          <NavLink href="/" active={pathname === "/"}>
            Templates
          </NavLink>
          <NavLink href="#" active={false}>
            My Projects
          </NavLink>
          <NavLink href="#" active={false}>
            Help
          </NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
            
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 transition-colors duration-300">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`
        relative py-2 
        ${active ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"} 
        transition-colors duration-300
      `}
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500" />}
    </Link>
  )
}

