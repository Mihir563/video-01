"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronUp,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full bg-gradient-to-t from-primary/5 to-transparent py-16 mt-16">
      <div className="container mx-auto px-4">
        {/* Back to top button */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            onClick={scrollToTop}
            className="bg-zinc-400 hover:bg-primary/90 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Logo and about */}
          <motion.div variants={item} className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">E-Album Creator</h3>
            <p className="text-muted-foreground mb-4">
              Transform your creative passion into recognition and rewards with
              our elite creator program.
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </Link>
              <Link
                href="https://www.instagram.com/ealbum.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-primary" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item} className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About Us", "Creator Program", "Gallery", "FAQ"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={item} className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Tutorials"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item} className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic">
              <div className="flex items-start space-x-2 text-muted-foreground mb-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  421, Arth business center, Nikol, S.P Ring Road
                  <br />
                  Ahmedabad, Gujarat, 382350.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@ealbumcreator.com"
                  className="hover:text-primary hover:underline transition-colors duration-300"
                >
                  ealbum@codnix.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+918128066331"
                  className="hover:text-primary hover:underline transition-colors duration-300"
                >
                  +91 8128066331
                </a>
              </div>
            </address>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex justify-center items-center gap-8 py-8 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            href="https://codnix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 duration-300"
          >
            <Image
              src="/Codnix-Logo-Transperent.png"
              alt="Codnix Logo"
              width={120}
              height={45}
              className="object-contain"
            />
          </Link>
          <Link
            href="https://ealbum.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 duration-300"
          >
            <Image
              src="/ealbum-Logo-dark.png"
              alt="E-Album Logo"
              width={140}
              height={45}
              className="object-contain"
              priority
            />
          </Link>
        </motion.div>

        {/* Bottom section with copyright and terms */}
        <motion.div
          className="pt-8 border-t border-border flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col items-center mb-6">
            <p className="text-sm text-muted-foreground mb-6">
              {`© ${currentYear} E-Album Creator. All rights reserved.`}
            </p>
            <div className="bg-primary/10 px-6 py-3 rounded-full mb-6 transform hover:scale-105 transition-all duration-300">
              <p className="text-base md:text-lg font-medium">
                Powered by{" "}
                <Link
                  href="https://codnix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold"
                >
                  CODNIX
                </Link>
              </p>
            </div>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://ealbum.in/privacy-policy/"
              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://ealbum.in/terms-conditions/"
              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
