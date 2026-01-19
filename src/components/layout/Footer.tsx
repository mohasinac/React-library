/**
 * Footer Component
 *
 * Main footer with links, social media, newsletter signup.
 * Mobile responsive with vertical stacking.
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - Multiple link columns
 * - Social media icons
 * - Newsletter signup (optional)
 * - Copyright text
 * - Mobile responsive (stacks vertically)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * import { Footer } from '@letitrip/react-library';
 * import Link from 'next/link';
 * import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
 *
 * <Footer
 *   LinkComponent={Link}
 *   logo={{ src: "/logo.png", alt: "Logo", href: "/" }}
 *   linkSections={[
 *     {
 *       title: "Shop",
 *       links: [
 *         { label: "All Products", href: "/products" },
 *         { label: "Categories", href: "/categories" }
 *       ]
 *     }
 *   ]}
 *   socialLinks={[
 *     { href: "https://facebook.com", icon: Facebook, label: "Facebook" }
 *   ]}
 *   copyright="© 2026 Letitrip. All rights reserved."
 *   showNewsletter={true}
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface FooterLogo {
  /** Logo image source */
  src: string;
  /** Logo alt text */
  alt: string;
  /** Logo link href */
  href: string;
  /** Logo width (default: 120) */
  width?: number;
  /** Logo height (default: 40) */
  height?: number;
}

export interface FooterLink {
  /** Link label */
  label: string;
  /** Link href */
  href: string;
  /** Open in new tab */
  external?: boolean;
}

export interface FooterLinkSection {
  /** Section title */
  title: string;
  /** Section links */
  links: FooterLink[];
}

export interface FooterSocialLink {
  /** Social platform href */
  href: string;
  /** Icon component */
  icon: LucideIcon;
  /** Accessible label */
  label: string;
}

export interface FooterProps {
  /** Link component for navigation */
  LinkComponent: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
    target?: string;
    rel?: string;
  }>;
  /** Logo configuration (optional) */
  logo?: FooterLogo;
  /** Footer description/tagline */
  description?: string;
  /** Link sections */
  linkSections?: FooterLinkSection[];
  /** Social media links */
  socialLinks?: FooterSocialLink[];
  /** Copyright text */
  copyright: string;
  /** Show newsletter signup */
  showNewsletter?: boolean;
  /** Newsletter callback */
  onNewsletterSubmit?: (email: string) => void | Promise<void>;
  /** Newsletter placeholder */
  newsletterPlaceholder?: string;
  /** Newsletter button text */
  newsletterButtonText?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Footer - Main footer component with links and social
 *
 * Responsive footer that stacks vertically on mobile.
 * Includes optional newsletter signup and social media links.
 */
export const Footer: React.FC<FooterProps> = ({
  LinkComponent,
  logo,
  description,
  linkSections = [],
  socialLinks = [],
  copyright,
  showNewsletter = false,
  onNewsletterSubmit,
  newsletterPlaceholder = "Enter your email",
  newsletterButtonText = "Subscribe",
  className,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !onNewsletterSubmit) return;

    setIsSubmitting(true);
    try {
      await onNewsletterSubmit(email);
      setEmail("");
    } catch (error) {
      console.error("Newsletter submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className={cn(
        "w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-4">
              {logo && (
                <LinkComponent href={logo.href} className="inline-block mb-4">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width || 120}
                    height={logo.height || 40}
                    className="h-8 w-auto object-contain"
                  />
                </LinkComponent>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  {description}
                </p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link Sections */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {linkSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <LinkComponent
                          href={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          {...(link.external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                        >
                          {link.label}
                        </LinkComponent>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Signup */}
            {showNewsletter && onNewsletterSubmit && (
              <div className="lg:col-span-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  Newsletter
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Subscribe to get special offers, free giveaways, and updates.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterPlaceholder}
                    required
                    disabled={isSubmitting}
                    className={cn(
                      "w-full px-4 py-2 text-sm rounded-lg",
                      "bg-white dark:bg-gray-800",
                      "border border-gray-300 dark:border-gray-700",
                      "text-gray-900 dark:text-white",
                      "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                    aria-label="Email address for newsletter"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className={cn(
                      "w-full px-4 py-2 text-sm font-medium rounded-lg",
                      "bg-blue-600 hover:bg-blue-700 text-white",
                      "transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    )}
                  >
                    {isSubmitting ? "Subscribing..." : newsletterButtonText}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
