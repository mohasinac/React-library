/**
 * Header Component
 *
 * Main navigation header with logo, search, cart, and user menu.
 * Mobile responsive with hamburger menu.
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - Mobile hamburger menu (<768px)
 * - Search bar with toggle
 * - Cart badge with item count
 * - User menu dropdown
 * - Dark mode support
 * - Sticky positioning option
 *
 * @example
 * ```tsx
 * import { Header } from '@letitrip/react-library';
 * import Link from 'next/link';
 * import { Menu, Search, ShoppingCart, User } from 'lucide-react';
 *
 * <Header
 *   LinkComponent={Link}
 *   currentPath="/products"
 *   logo={{ src: "/logo.png", alt: "Logo", href: "/" }}
 *   cartItemCount={3}
 *   isAuthenticated={true}
 *   user={{ name: "John Doe", avatar: "/avatar.jpg" }}
 *   onMenuToggle={() => setMobileMenuOpen(true)}
 *   onSearchToggle={() => setSearchOpen(true)}
 *   icons={{ menu: Menu, search: Search, cart: ShoppingCart, user: User }}
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import React from "react";
import { cn } from "../../utils/cn";

export interface HeaderLogo {
  /** Logo image source (supports .svg, .png, .jpg, etc.) */
  src: string;
  /** Logo alt text */
  alt: string;
  /** Logo link href */
  href: string;
  /** Logo width (default: 120) */
  width?: number;
  /** Logo height (default: 40) */
  height?: number;
  /** Force use of SVG component instead of img tag (for inline SVG) */
  isSvg?: boolean;
}

export interface HeaderUser {
  /** User display name */
  name: string;
  /** User email (optional) */
  email?: string;
  /** User avatar URL */
  avatar?: string;
}

export interface HeaderNavItem {
  /** Navigation label */
  label: string;
  /** Navigation href */
  href: string;
  /** Show only on desktop */
  desktopOnly?: boolean;
}

export interface HeaderIcons {
  /** Menu/hamburger icon */
  menu: LucideIcon;
  /** Search icon */
  search: LucideIcon;
  /** Shopping cart icon */
  cart: LucideIcon;
  /** User/profile icon */
  user: LucideIcon;
  /** Close icon (for mobile menu) */
  close?: LucideIcon;
}

export interface HeaderProps {
  /** Link component for navigation */
  LinkComponent: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
  /** Current pathname for active state */
  currentPath?: string;
  /** Logo configuration */
  logo: HeaderLogo;
  /** Navigation items */
  navItems?: HeaderNavItem[];
  /** Cart item count */
  cartItemCount?: number;
  /** Is user authenticated */
  isAuthenticated?: boolean;
  /** Current user info */
  user?: HeaderUser;
  /** Callback for mobile menu toggle */
  onMenuToggle?: () => void;
  /** Callback for search toggle */
  onSearchToggle?: () => void;
  /** Callback for cart click */
  onCartClick?: () => void;
  /** Callback for user menu click */
  onUserClick?: () => void;
  /** Icons to use */
  icons: HeaderIcons;
  /** Make header sticky */
  sticky?: boolean;
  /** Show search bar */
  showSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Children to render (optional) */
  children?: ReactNode;
}

/**
 * Header - Main navigation header component
 *
 * Responsive header with logo, navigation, search, cart, and user menu.
 * Automatically adapts to mobile with hamburger menu below 768px.
 */
export const Header: React.FC<HeaderProps> = ({
  LinkComponent,
  currentPath = "",
  logo,
  navItems = [],
  cartItemCount = 0,
  isAuthenticated = false,
  user,
  onMenuToggle,
  onSearchToggle,
  onCartClick,
  onUserClick,
  icons,
  sticky = false,
  showSearch = true,
  searchPlaceholder = "Search...",
  className,
  children,
}) => {
  const MenuIcon = icons.menu;
  const SearchIcon = icons.search;
  const CartIcon = icons.cart;
  const UserIcon = icons.user;

  return (
    <header
      className={cn(
        "w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
        sticky && "sticky top-0 z-50",
        className,
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
            type="button"
          >
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <LinkComponent
            href={logo.href}
            className="flex items-center flex-shrink-0"
          >
            {logo.isSvg || logo.src.endsWith(".svg") ? (
              <object
                data={logo.src}
                type="image/svg+xml"
                aria-label={logo.alt}
                className="h-8 md:h-10 w-auto object-contain"
                style={{
                  width: logo.width || 120,
                  height: logo.height || 40,
                  maxHeight: "100%",
                }}
              >
                {/* Fallback for browsers that don't support object tag */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={logo.height || 40}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </object>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 40}
                className="h-8 md:h-10 w-auto object-contain"
              />
            )}
          </LinkComponent>

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden lg:flex items-center space-x-6 flex-1 ml-8">
              {navItems.map((item) => {
                if (item.desktopOnly) {
                  const isActive = currentPath === item.href;
                  return (
                    <LinkComponent
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
                      )}
                    >
                      {item.label}
                    </LinkComponent>
                  );
                }
                return null;
              })}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Button */}
            {showSearch && onSearchToggle && (
              <button
                onClick={onSearchToggle}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open search"
                type="button"
              >
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
              type="button"
            >
              <CartIcon className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-full"
                  aria-hidden="true"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu Button */}
            {isAuthenticated ? (
              <button
                onClick={onUserClick}
                className="flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
                type="button"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="hidden md:inline text-sm font-medium">
                  {user?.name}
                </span>
              </button>
            ) : (
              <LinkComponent
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign In
              </LinkComponent>
            )}
          </div>
        </div>
      </div>

      {/* Optional Children (e.g., breadcrumbs, secondary nav) */}
      {children && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          {children}
        </div>
      )}
    </header>
  );
};
