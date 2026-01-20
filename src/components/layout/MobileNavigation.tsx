/**
 * MobileNavigation Component
 *
 * Bottom navigation bar for mobile devices.
 * Provides quick access to main app sections.
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - Fixed bottom positioning on mobile
 * - Active state indication
 * - Badge support (e.g., cart count)
 * - Hidden on desktop (≥1024px)
 * - Dark mode support
 * - Accessibility compliant
 *
 * @example
 * ```tsx
 * import { MobileNavigation } from '@letitrip/react-library';
 * import Link from 'next/link';
 * import { Home, Search, ShoppingCart, User } from 'lucide-react';
 *
 * <MobileNavigation
 *   LinkComponent={Link}
 *   currentPath="/products"
 *   items={[
 *     { label: "Home", href: "/", icon: Home },
 *     { label: "Search", href: "/search", icon: Search },
 *     { label: "Cart", href: "/cart", icon: ShoppingCart, badge: 3 },
 *     { label: "Profile", href: "/profile", icon: User }
 *   ]}
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import React from "react";
import { cn } from "../../utils/cn";

export interface MobileNavItem {
  /** Navigation label */
  label: string;
  /** Navigation href */
  href: string;
  /** Icon component */
  icon: LucideIcon;
  /** Badge count (e.g., cart items) */
  badge?: number;
  /** Show badge dot (for notifications) */
  showBadgeDot?: boolean;
}

export interface MobileNavigationProps {
  /** Link component for navigation */
  LinkComponent: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
    "aria-label"?: string;
  }>;
  /** Current pathname for active state */
  currentPath: string;
  /** Navigation items (3-5 recommended) */
  items: MobileNavItem[];
  /** Hide on desktop breakpoint (default: 1024px / lg) */
  hideOnDesktop?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MobileNavigation - Bottom navigation bar for mobile
 *
 * Fixed bottom bar with 3-5 navigation items.
 * Automatically hidden on desktop (≥1024px by default).
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  LinkComponent,
  currentPath,
  items,
  hideOnDesktop = true,
  className,
}) => {
  // Validate item count
  if (items.length < 3 || items.length > 5) {
    console.warn(
      `MobileNavigation: Recommended 3-5 items, received ${items.length}`,
    );
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-white dark:bg-black",
        "border-t border-slate-200 dark:border-neutral-800",
        "safe-area-inset-bottom", // For iOS notch support
        hideOnDesktop && "lg:hidden",
        className,
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around h-16 max-w-screen-sm mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <LinkComponent
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-w-0 relative",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                isActive
                  ? "text-primary dark:text-primary-400"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon with Badge */}
              <div className="relative mb-1">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-transform",
                    isActive && "scale-110",
                  )}
                  aria-hidden="true"
                />

                {/* Badge Count */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] px-1 flex items-center justify-center text-xs font-bold text-white bg-secondary rounded-full"
                    aria-label={`${item.badge} items`}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}

                {/* Badge Dot (for notifications) */}
                {item.showBadgeDot && (
                  <span
                    className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
                    aria-label="New notification"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium truncate max-w-full px-1",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary dark:bg-primary-400 rounded-b-full"
                  aria-hidden="true"
                />
              )}
            </LinkComponent>
          );
        })}
      </div>
    </nav>
  );
};
