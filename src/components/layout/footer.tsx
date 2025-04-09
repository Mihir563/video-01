import type React from "react"
export default function Footer() {
  return (
    <footer className="bg-gray-50/50 dark:bg-black/50 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              VideoFusion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create stunning videos with our premium templates and your images.
            </p>
            <div className="flex space-x-4">
              <SocialIcon />
              <SocialIcon />
              <SocialIcon />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-2">
              <FooterLink>Templates</FooterLink>
              <FooterLink>Pricing</FooterLink>
              <FooterLink>Features</FooterLink>
              <FooterLink>Showcase</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Resources</h4>
            <ul className="space-y-2">
              <FooterLink>Help Center</FooterLink>
              <FooterLink>Blog</FooterLink>
              <FooterLink>Tutorials</FooterLink>
              <FooterLink>API</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-2">
              <FooterLink>About</FooterLink>
              <FooterLink>Careers</FooterLink>
              <FooterLink>Contact</FooterLink>
              <FooterLink>Legal</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 VideoFusion. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-gray-500 dark:text-gray-500 text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-gray-500 dark:text-gray-500 text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">
              Terms of Service
            </span>
            <span className="text-gray-500 dark:text-gray-500 text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">
              Cookie Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <a
        href="#"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
      >
        {children}
      </a>
    </li>
  )
}

function SocialIcon() {
  return (
    <a
      href="#"
      className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
    >
      <span className="sr-only">Social Media</span>
      <div className="w-5 h-5 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
    </a>
  )
}

