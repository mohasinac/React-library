/**
 * AdvertisementBanner Component
 *
 * Top banner for displaying advertisements and promotional content.
 * Appears above the main navigation on all pages (typically 10% height).
 *
 * Features:
 * - Framework-agnostic (inject Link component)
 * - Support for image or background color
 * - Optional call-to-action button
 * - Closeable/dismissible option
 * - Responsive design (stacks vertically on mobile)
 * - Dark mode support
 * - Accessibility features
 *
 * @example
 * ```tsx
 * import { AdvertisementBanner } from '@letitrip/react-library';
 * import Link from 'next/link';
 *
 * // Simple text banner
 * <AdvertisementBanner
 *   LinkComponent={Link}
 *   content="🎉 New Year Sale! Get 50% off on all products"
 *   ctaText="Shop Now"
 *   ctaHref="/products"
 *   backgroundColor="#1e40af"
 * />
 *
 * // Banner with image
 * <AdvertisementBanner
 *   LinkComponent={Link}
 *   content="Summer Collection Now Available"
 *   backgroundImage="/banners/summer-sale.jpg"
 *   ctaText="Explore"
 *   ctaHref="/categories"
 *   isDismissible={true}
 * />
 *
 * // Full-width clickable banner
 * <AdvertisementBanner
 *   LinkComponent={Link}
 *   content="Free Shipping on Orders Over $50"
 *   href="/shipping-info"
 *   backgroundColor="#059669"
 * />
 * ```
 */

import type { ComponentType, ReactNode } from "react";
import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface AdvertisementBannerProps {
  /** Link component for navigation */
  LinkComponent: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
  /** Banner content/message */
  content: string | ReactNode;
  /** Call-to-action button text */
  ctaText?: string;
  /** Call-to-action button href */
  ctaHref?: string;
  /** Make entire banner clickable (overrides CTA) */
  href?: string;
  /** Background color (hex or named color) */
  backgroundColor?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Text color (default: white for dark bg, black for light bg) */
  textColor?: string;
  /** Allow user to dismiss/close banner */
  isDismissible?: boolean;
  /** Callback when banner is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AdvertisementBanner - Top promotional banner
 *
 * Displays promotional content, announcements, or advertisements
 * at the top of the page. Can be dismissible and includes CTA options.
 */
export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  LinkComponent,
  content,
  ctaText,
  ctaHref,
  href,
  backgroundColor = "#1e3a8a",
  backgroundImage,
  textColor,
  isDismissible = false,
  onDismiss,
  className,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isDismissed) {
    return null;
  }

  const bannerStyle: React.CSSProperties = {
    backgroundColor: backgroundImage ? undefined : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: backgroundImage ? "cover" : undefined,
    backgroundPosition: backgroundImage ? "center" : undefined,
    color: textColor || "white",
  };

  const BannerContent = () => (
    <>
      {/* Content */}
      <div className="flex-1 flex items-center justify-center text-center px-4 py-3">
        {typeof content === "string" ? (
          <p className="text-sm md:text-base font-medium">{content}</p>
        ) : (
          content
        )}
      </div>

      {/* CTA Button */}
      {ctaText && ctaHref && !href && (
        <LinkComponent
          href={ctaHref}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
            "bg-white/20 hover:bg-white/30 backdrop-blur-sm",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
          )}
        >
          {ctaText}
        </LinkComponent>
      )}

      {/* Dismiss Button */}
      {isDismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-white/20",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
          )}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </>
  );

  // If entire banner is clickable
  if (href) {
    return (
      <LinkComponent href={href}>
        <div
          className={cn(
            "w-full relative overflow-hidden",
            "transition-all duration-300",
            className,
          )}
          style={bannerStyle}
          role="banner"
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 min-h-[48px] md:min-h-[56px]">
              <BannerContent />
            </div>
          </div>
          {/* Overlay for better text readability on images */}
          {backgroundImage && (
            <div className="absolute inset-0 bg-black/30 -z-10" />
          )}
        </div>
      </LinkComponent>
    );
  }

  // Regular banner with optional CTA
  return (
    <div
      className={cn(
        "w-full relative overflow-hidden",
        "transition-all duration-300",
        className,
      )}
      style={bannerStyle}
      role="banner"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 min-h-[48px] md:min-h-[56px]">
          <BannerContent />
        </div>
      </div>
      {/* Overlay for better text readability on images */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/30 -z-10" />
      )}
    </div>
  );
};
