import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface HorizontalScrollerProps {
  /** Array of items to render */
  children: ReactNode;
  /** Section title */
  title?: string;
  /** Title heading level */
  titleLevel?: "h2" | "h3" | "h4";
  /** Additional header content (e.g., filters, sort buttons) */
  headerActions?: ReactNode;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Arrow size */
  arrowSize?: "sm" | "md" | "lg";
  /** Item width (CSS value) */
  itemWidth?: string | number;
  /** Gap between items (CSS value) */
  gap?: string | number;
  /** Scroll amount percentage of visible width (default: 0.8) */
  scrollPercentage?: number;
  /** Custom arrow icons */
  icons?: {
    chevronLeft?: ReactNode;
    chevronRight?: ReactNode;
  };
  /** Additional container CSS classes */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyState?: ReactNode;
}

/**
 * HorizontalScroller Component
 *
 * **Generic horizontal scrolling container** with navigation arrows.
 * Works for any content - subcategories, featured items, sellers, etc.
 *
 * Features:
 * - Smooth horizontal scrolling with navigation
 * - Auto-hide arrows based on scroll position
 * - Responsive design
 * - Loading and empty states
 * - Customizable item width and gap
 * - Framework-independent
 *
 * @example
 * ```tsx
 * <HorizontalScroller
 *   title="Featured Categories"
 *   showArrows
 *   itemWidth="200px"
 *   gap="1rem"
 * >
 *   {items.map(item => <CategoryCard key={item.id} {...item} />)}
 * </HorizontalScroller>
 * ```
 */
export function HorizontalScroller({
  children,
  title,
  titleLevel = "h2",
  headerActions,
  showArrows = true,
  arrowSize = "md",
  itemWidth,
  gap = "1rem",
  scrollPercentage = 0.8,
  icons,
  className = "",
  loading = false,
  emptyState,
}: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const TitleTag = titleLevel;

  // Check scroll position to show/hide arrows
  const updateArrowVisibility = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Setup scroll listeners
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateArrowVisibility();
    container.addEventListener("scroll", updateArrowVisibility);
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      container.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [children]);

  // Scroll handler
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * scrollPercentage;
    const newPosition =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  // Default icons
  const defaultChevronLeft = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );

  const defaultChevronRight = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  // Arrow size classes
  const arrowSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={className}>
        {title && (
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        )}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{ minWidth: itemWidth || "200px" }}
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (emptyState && React.Children.count(children) === 0) {
    return (
      <div className={className}>
        {title && (
          <TitleTag className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </TitleTag>
        )}
        {emptyState}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <TitleTag className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </TitleTag>
          )}
          {headerActions}
        </div>
      )}

      {/* Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showArrows && showLeftArrow && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 ${arrowSizeClasses[arrowSize]} flex items-center justify-center bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100`}
            aria-label="Scroll left"
          >
            {icons?.chevronLeft || defaultChevronLeft}
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            gap: typeof gap === "number" ? `${gap}px` : gap,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {React.Children.map(children, (child, index) =>
            itemWidth ? (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  width:
                    typeof itemWidth === "number"
                      ? `${itemWidth}px`
                      : itemWidth,
                }}
              >
                {child}
              </div>
            ) : (
              <div key={index} className="flex-shrink-0">
                {child}
              </div>
            ),
          )}
        </div>

        {/* Right Arrow */}
        {showArrows && showRightArrow && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 ${arrowSizeClasses[arrowSize]} flex items-center justify-center bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100`}
            aria-label="Scroll right"
          >
            {icons?.chevronRight || defaultChevronRight}
          </button>
        )}
      </div>
    </div>
  );
}
