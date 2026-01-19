/**
 * HeroSlide - Dynamic Hero/Banner Component with Grid Positioning
 *
 * Features:
 * - Background image or video support
 * - 3x3 grid positioning for content (title, description, CTA)
 * - Mobile responsive (auto-centers on small screens)
 * - Overlay effects and customizable styling
 *
 * @packageDocumentation
 */

import type { ComponentType, ReactNode } from "react";

export type GridPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface HeroSlideProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL */
  backgroundVideo?: string;
  /** Hero title */
  title?: string;
  /** Hero description/subtitle */
  description?: string;
  /** Call-to-action button */
  cta?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  /** Content position in 3x3 grid */
  contentPosition?: GridPosition;
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Image component for background */
  ImageComponent?: ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
  }>;
  /** Link component for CTA */
  LinkComponent?: ComponentType<{
    href: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
  }>;
  /** Minimum height */
  minHeight?: string;
  /** Additional CSS classes */
  className?: string;
}

const gridPositionClasses: Record<GridPosition, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",
  "middle-left": "items-center justify-start",
  "middle-center": "items-center justify-center",
  "middle-right": "items-center justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};

// Mobile responsive positioning - moves to center row on small screens
const mobilePositionClasses: Record<GridPosition, string> = {
  "top-left": "max-sm:items-start max-sm:justify-center",
  "top-center": "max-sm:items-start max-sm:justify-center",
  "top-right": "max-sm:items-start max-sm:justify-center",
  "middle-left": "max-sm:items-center max-sm:justify-center",
  "middle-center": "max-sm:items-center max-sm:justify-center",
  "middle-right": "max-sm:items-center max-sm:justify-center",
  "bottom-left": "max-sm:items-end max-sm:justify-center",
  "bottom-center": "max-sm:items-end max-sm:justify-center",
  "bottom-right": "max-sm:items-end max-sm:justify-center",
};

export function HeroSlide({
  backgroundImage,
  backgroundVideo,
  title,
  description,
  cta,
  contentPosition = "middle-center",
  overlayOpacity = 40,
  ImageComponent,
  LinkComponent,
  minHeight = "500px",
  className = "",
}: HeroSlideProps) {
  const DefaultImage = ({
    src,
    alt,
    fill,
    className: imgClassName,
    priority,
  }: any) => (
    <img
      src={src}
      alt={alt}
      className={`${
        fill ? "absolute inset-0 w-full h-full object-cover" : ""
      } ${imgClassName || ""}`}
      loading={priority ? "eager" : "lazy"}
    />
  );

  const DefaultLink = ({
    href,
    className: linkClassName,
    onClick,
    children,
  }: any) => (
    <a href={href} className={linkClassName} onClick={onClick}>
      {children}
    </a>
  );

  const Image = ImageComponent || DefaultImage;
  const Link = LinkComponent || DefaultLink;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Background Media */}
      {backgroundVideo ? (
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={title || "Hero background"}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content Container with Grid Positioning */}
      <div
        className={`relative z-10 h-full w-full flex p-6 md:p-12 lg:p-16 ${gridPositionClasses[contentPosition]} ${mobilePositionClasses[contentPosition]}`}
        style={{ minHeight }}
      >
        <div className="max-w-3xl text-white">
          {/* Title */}
          {title && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-100 drop-shadow-md">
              {description}
            </p>
          )}

          {/* CTA Button */}
          {cta && (
            <Link
              href={cta.href}
              onClick={cta.onClick}
              className="inline-block bg-white text-gray-900 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {cta.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
