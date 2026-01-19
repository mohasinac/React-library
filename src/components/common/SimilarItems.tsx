import React, { ComponentType, useEffect, useRef, useState } from "react";

export interface SimilarItemsProps<T = any> {
  items: T[];
  currentItemId?: string;
  loading?: boolean;
  title?: string;
  categoryName?: string;
  showViewAllButton?: boolean;
  maxDisplayItems?: number;
  onLoadItems?: () => void;
  showAllModal?: boolean;
  onShowAllModalChange?: (show: boolean) => void;
  // Component injections
  ItemCardComponent: ComponentType<{
    item: T;
    [key: string]: any;
  }>;
  CardGridComponent?: ComponentType<{
    children: React.ReactNode;
    className?: string;
  }>;
  // Icon injections
  icons?: {
    grid?: React.ReactNode;
    x?: React.ReactNode;
    empty?: React.ReactNode;
    chevronLeft?: React.ReactNode;
    chevronRight?: React.ReactNode;
  };
  className?: string;
}

/**
 * SimilarItems Component
 *
 * **Universal component** for displaying similar/related items with horizontal scroll and modal view.
 * Works for products, auctions, categories, shops, or any resource type.
 *
 * Features:
 * - Horizontal scrollable carousel with nav buttons
 * - Optional "View All" modal with grid layout
 * - Loading skeleton states
 * - Empty state handling
 * - Filters out current item from list
 * - Responsive design
 * - Framework-independent with dependency injection
 *
 * @example
 * ```tsx
 * // For products
 * <SimilarItems
 *   items={similarProducts}
 *   currentItemId={product.id}
 *   title="You might also like"
 *   ItemCardComponent={ProductCard}
 *   CardGridComponent={CardGrid}
 * />
 *
 * // For auctions
 * <SimilarItems
 *   items={similarAuctions}
 *   currentItemId={auction.id}
 *   title="Similar Auctions"
 *   ItemCardComponent={AuctionCard}
 * />
 * ```
 */
export function SimilarItems<T extends { id: string }>({
  items,
  currentItemId,
  loading = false,
  title = "You might also like",
  categoryName,
  showViewAllButton = true,
  maxDisplayItems = 16,
  onLoadItems,
  showAllModal = false,
  onShowAllModalChange,
  ItemCardComponent,
  CardGridComponent,
  icons = {},
  className = "",
}: SimilarItemsProps<T>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load items on mount or when dependencies change
  useEffect(() => {
    if (onLoadItems) {
      onLoadItems();
    }
  }, [currentItemId, onLoadItems]);

  // Horizontal scroll handler
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  // Update scroll button visibility
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10,
    );
  };

  // Setup scroll listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [items]);

  // Default SVG icons
  const defaultGridIcon = (
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
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );

  const defaultXIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const defaultEmptyIcon = (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  const defaultChevronLeft = (
    <svg
      className="w-6 h-6"
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
      className="w-6 h-6"
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

  // Default CardGrid fallback
  const DefaultCardGrid =
    CardGridComponent ||
    (({ children }: { children: React.ReactNode }) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    ));

  // Filter out current item
  const filteredItems = currentItemId
    ? items.filter((item) => item.id !== currentItemId)
    : items;

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredItems.length === 0) {
    return null;
  }

  const displayItems = filteredItems.slice(0, maxDisplayItems);
  const hasMore = filteredItems.length > maxDisplayItems;

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {hasMore && showViewAllButton && onShowAllModalChange && (
            <button
              onClick={() => onShowAllModalChange(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {icons.grid || defaultGridIcon}
              <span>View All ({filteredItems.length})</span>
            </button>
          )}
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll left"
            >
              {icons.chevronLeft || defaultChevronLeft}
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll right"
            >
              {icons.chevronRight || defaultChevronRight}
            </button>
          )}

          {/* Scrollable Items */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-44 sm:w-48">
                <ItemCardComponent item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Category Label */}
        {categoryName && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            From {categoryName}
          </p>
        )}
      </div>

      {/* View All Modal */}
      {showAllModal && onShowAllModalChange && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => onShowAllModalChange(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title} ({filteredItems.length})
              </h2>
              <button
                onClick={() => onShowAllModalChange(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close modal"
              >
                {icons.x || defaultXIcon}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {filteredItems.length > 0 ? (
                <DefaultCardGrid className="gap-4">
                  {filteredItems.map((item) => (
                    <ItemCardComponent key={item.id} item={item} />
                  ))}
                </DefaultCardGrid>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  {icons.empty || defaultEmptyIcon}
                  <p className="mt-4 text-lg font-medium">No items found</p>
                  <p className="text-sm">Check back later for more options</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
