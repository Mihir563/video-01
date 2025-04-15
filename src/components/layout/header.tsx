"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// import { ThemeToggle } from "@/components/theme/theme-toggle"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [albumCode, setAlbumCode] = useState<string | null>(null)
  
  console.log(albumCode)
  // Extract album code from URL query parameter
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('c')
      if (code) {
        setAlbumCode(code)
      } else {
        // Fallback to path extraction if no query param
        const albumIdFromPath = pathname.includes('/select-images/') 
          ? pathname.split('/select-images/')[1].split('/')[1] 
          : null
        setAlbumCode(albumIdFromPath)
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 
        ${
          scrolled
            ? "bg-background/80 backdrop-blur-md py-3"
            : "bg-background/60 py-5"
        }
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
        >
          {scrolled ? (
            <Image
              height={100}
              width={100}
              alt="ealbum"
              src={
                "https://ealbum.in/wp-content/uploads/2019/07/ealbum-Logo-_-light.png"
              }
            />
          ) : (
            <Image
              height={100}
              width={100}
              alt="ealbum"
              src={
                "https://ealbum.in/wp-content/uploads/2019/07/ealbum-logo-dark.png"
              }
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/" active={pathname === "/"}>
            Templates
          </NavLink>
          <NavLink 
            href="myvideos" 
            active={pathname.includes('/myvideos') || pathname.includes('/projects')}
            isVideoLink={true}
          >
            My Videos
          </NavLink>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center space-x-4">
          {/* <ThemeToggle /> */}
          
          <button 
            className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              href="/" 
              active={pathname === "/"}
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </NavLink>
            <NavLink 
              href="myvideos" 
              active={pathname.includes('/myvideos') || pathname.includes('/projects')}
              isVideoLink={true}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Videos
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  preserveQuery = true,
  isVideoLink = false,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  preserveQuery?: boolean
  isVideoLink?: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const [finalHref, setFinalHref] = useState(href)
  
  useEffect(() => {
    if (typeof window !== 'undefined' && preserveQuery) {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('c')
      
      if (code) {
        if (isVideoLink) {
          // If it's a video link, go to `/myvideos?c=CODE`
          setFinalHref(`/myvideos?c=${code}`)
        } else if (href === "/") {
          // For root path, keep it classy: `/?c=CODE`
          setFinalHref(`/?c=${code}`)
        } else {
          setFinalHref(`${href}?c=${code}`)
        }
      } else {
        // No album code? No worries. Just go where you were going.
        setFinalHref(href)
      }
      
    } else {
      setFinalHref(href)
    }
  }, [href, pathname, preserveQuery, isVideoLink])
  
  return (
    <Link
      href={finalHref}
      className={`
        relative py-2 
        ${active ? "text-primary font-medium" : "text-foreground hover:text-primary/90"} 
        transition-all duration-300 group
      `}
    >
      {children}
      <span 
        className={`
          absolute bottom-0 left-0 w-full h-0.5 
          bg-gradient-to-r from-primary to-accent 
          transition-all duration-300 
          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-70"} 
          ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"} 
          origin-left
        `} 
      />
    </Link>
  )
}

