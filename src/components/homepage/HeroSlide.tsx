/**
 * HeroSlide - Dynamic Hero/Banner Component with Grid Positioning
 *
 * Features:
 * - Background image or video support with controls
 * - Multiple video sources for browser compatibility
 * - Video poster image and loading states
 * - Play/pause and mute/unmute controls
 * - 3x3 grid positioning for content (title, description, CTA)
 * - Mobile responsive (auto-centers on small screens)
 * - Overlay effects and customizable styling
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * // With video background
 * <HeroSlide
 *   backgroundVideo="/videos/hero.mp4"
 *   videoPoster="/images/poster.jpg"
 *   videoSources={[
 *     { src: "/videos/hero.webm", type: "video/webm" },
 *     { src: "/videos/hero.mp4", type: "video/mp4" }
 *   ]}
 *   showVideoControls
 *   title="Welcome"
 *   cta={{ text: "Get Started", href: "/products" }}
 * />
 * ```
 *
 * @packageDocumentation
 */

import type { ComponentType, ReactNode } from "react";
import { useRef, useState } from "react";

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

export interface VideoSource {
  /** Video file URL */
  src: string;
  /** MIME type (e.g., 'video/mp4', 'video/webm') */
  type: string;
}

export interface HeroSlideProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL (primary source) */
  backgroundVideo?: string;
  /** Multiple video sources for browser compatibility */
  videoSources?: VideoSource[];
  /** Video poster image (shown before video loads) */
  videoPoster?: string;
  /** Show video control buttons (play/pause, mute) */
  showVideoControls?: boolean;
  /** Auto-play video (default: true) */
  autoPlay?: boolean;
  /** Loop video (default: true) */
  loop?: boolean;
  /** Mute video by default (default: true) */
  muted?: boolean;
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
  videoSources,
  videoPoster,
  showVideoControls = false,
  autoPlay = true,
  loop = true,
  muted = true,
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
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Video control handlers
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Background Media */}
      {backgroundVideo || videoSources ? (
        <>
          <video
            ref={videoRef}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            poster={videoPoster}
            className="absolute inset-0 w-full h-full object-cover"
            aria-label={title || "Background video"}
          >
            {videoSources?.map((source, index) => (
              <source key={index} src={source.src} type={source.type} />
            ))}
            {backgroundVideo && !videoSources && (
              <source src={backgroundVideo} type="video/mp4" />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          {showVideoControls && (
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </>
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
