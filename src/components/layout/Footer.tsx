/**
 * Footer Component
 *
 * Main footer with 3-row × 4-column grid layout.
 * Mobile responsive with vertical stacking.
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - 3 rows × 4 columns grid structure
 * - Row 1: Link sections (categorized page links)
 * - Row 2: Partner logos (Lucide brand icons or SVG)
 * - Row 3: Copyright text
 * - Mobile responsive (stacks vertically)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * import { Footer } from '@letitrip/react-library';
 * import Link from 'next/link';
 * import { ShoppingBag, Package, TruckIcon, CreditCard } from 'lucide-react';
 *
 * <Footer
 *   LinkComponent={Link}
 *   linkSections={[
 *     {
 *       title: "Shop",
 *       links: [
 *         { label: "All Products", href: "/products" },
 *         { label: "Categories", href: "/categories" }
 *       ]
 *     },
 *     // ... 3 more sections for 4 columns
 *   ]}
 *   partnerLogos={[
 *     { icon: ShoppingBag, label: "Partner 1" },
 *     { icon: Package, label: "Partner 2" },
 *     // ... more partners
 *   ]}
 *   copyright="© 2026 Letitrip. All rights reserved."
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import React from "react";
import { cn } from "../../utils/cn";

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

export interface PartnerLogo {
  /** Icon component (Lucide icon or custom SVG) */
  icon: LucideIcon;
  /** Partner name (for accessibility) */
  label: string;
  /** Optional link to partner site */
  href?: string;
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
  /** Link sections for Row 1 (should be 4 sections for 4 columns) */
  linkSections: FooterLinkSection[];
  /** Partner logos for Row 2 */
  partnerLogos?: PartnerLogo[];
  /** Copyright text for Row 3 */
  copyright: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Footer - Main footer component with 3-row × 4-column grid
 *
 * Structure:
 * - Row 1: 4 columns of categorized links
 * - Row 2: Partner logos (brand icons)
 * - Row 3: Copyright text
 *
 * Mobile responsive - stacks vertically on smaller screens.
 */
export const Footer: React.FC<FooterProps> = ({
  LinkComponent,
  linkSections,
  partnerLogos = [],
  copyright,
  className,
}) => {
  return (
    <footer
      className={cn(
        "w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Link Sections (4 columns) */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
        </div>

        {/* Row 2: Partner Logos */}
        {partnerLogos.length > 0 && (
          <div className="py-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partnerLogos.map((partner) => {
                const Icon = partner.icon;
                const content = (
                  <div className="flex flex-col items-center gap-2 group">
                    <Icon
                      className="h-8 w-8 text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {partner.label}
                    </span>
                  </div>
                );

                if (partner.href) {
                  return (
                    <a
                      key={partner.label}
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                      aria-label={`Visit ${partner.label}`}
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={partner.label}>{content}</div>;
              })}
            </div>
          </div>
        )}

        {/* Row 3: Copyright */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
