/**
 * SubNavigation Component
 *
 * Context-specific sidebar navigation for Admin, Seller, and User dashboards.
 * Provides persistent sidebar with collapsible sections and active link highlighting.
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - Three contexts: Admin, Seller, User
 * - Desktop: Visible sidebar with toggle
 * - Mobile: Hidden by default, opens with hamburger
 * - Left sidebar: Admin/Seller
 * - Right sidebar: User (allows both open simultaneously)
 * - Collapsible sections
 * - Active link highlighting
 * - Dark mode support
 * - Responsive design
 *
 * @example
 * ```tsx
 * import { SubNavigation } from '@letitrip/react-library';
 * import Link from 'next/link';
 * import { Package, ShoppingCart, Users } from 'lucide-react';
 *
 * <SubNavigation
 *   LinkComponent={Link}
 *   context="admin"
 *   sections={[
 *     {
 *       title: "Products",
 *       icon: Package,
 *       links: [
 *         { label: "All Products", href: "/admin/products", active: true },
 *         { label: "Categories", href: "/admin/categories" }
 *       ]
 *     }
 *   ]}
 *   isOpen={true}
 *   onToggle={() => setIsOpen(!isOpen)}
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import React, { useState } from "react";
import { cn } from "../../utils/cn";

export interface SubNavLink {
  /** Link label */
  label: string;
  /** Link href */
  href: string;
  /** Active state */
  active?: boolean;
  /** Badge count (optional) */
  badge?: number;
}

export interface SubNavSection {
  /** Section title */
  title: string;
  /** Section icon */
  icon: LucideIcon;
  /** Section links */
  links: SubNavLink[];
  /** Initially collapsed */
  defaultCollapsed?: boolean;
}

export interface SubNavigationProps {
  /** Link component for navigation */
  LinkComponent: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
  /** Navigation context (determines placement) */
  context: "admin" | "seller" | "user";
  /** Navigation sections */
  sections: SubNavSection[];
  /** Is sidebar open */
  isOpen: boolean;
  /** Toggle sidebar callback */
  onToggle: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SubNavigation - Context-specific sidebar navigation
 *
 * Provides collapsible sidebar navigation for Admin, Seller, and User dashboards.
 * Adapts placement based on context (left for Admin/Seller, right for User).
 */
export const SubNavigation: React.FC<SubNavigationProps> = ({
  LinkComponent,
  context,
  sections,
  isOpen,
  onToggle,
  className,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(
      sections
        .filter((section) => section.defaultCollapsed)
        .map((section) => section.title),
    ),
  );

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isLeft = context === "admin" || context === "seller";
  const isRight = context === "user";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out",
          isLeft && "left-0 border-r",
          isRight && "right-0 border-l",
          // Desktop: visible when open
          isOpen
            ? "translate-x-0"
            : isLeft
            ? "-translate-x-full"
            : "translate-x-full",
          // Mobile: always uses transform
          "lg:translate-x-0",
          className,
        )}
        aria-label={`${context} navigation`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {context} Dashboard
            </h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isCollapsed = collapsedSections.has(section.title);

              return (
                <div key={section.title}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-expanded={!isCollapsed}
                  >
                    <Icon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-left">{section.title}</span>
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  {/* Section Links */}
                  {!isCollapsed && (
                    <ul className="mt-1 space-y-1 pl-10">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <LinkComponent
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                              link.active
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                            )}
                          >
                            <span>{link.label}</span>
                            {link.badge !== undefined && link.badge > 0 && (
                              <span
                                className={cn(
                                  "px-2 py-0.5 text-xs font-medium rounded-full",
                                  link.active
                                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                                )}
                              >
                                {link.badge > 99 ? "99+" : link.badge}
                              </span>
                            )}
                          </LinkComponent>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer (Optional) */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onToggle}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors hidden lg:block"
            >
              {isOpen ? "Collapse" : "Expand"} Sidebar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
