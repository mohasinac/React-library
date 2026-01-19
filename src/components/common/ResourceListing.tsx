import { ReactNode, useState } from "react";

export interface ResourceListingFilters {
  [key: string]: any;
}

export interface ResourceListingProps<T = any> {
  items: T[];
  loading?: boolean;
  resourceName: string; // "Products", "Auctions", "Shops", etc.
  resourceSingular?: string; // "Product", "Auction", etc.
  // View options
  defaultView?: "grid" | "list";
  showViewToggle?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  // Sorting
  sortOptions?: Array<{ value: string; label: string }>;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  // Filtering
  filters?: ResourceListingFilters;
  onFiltersChange?: (filters: ResourceListingFilters) => void;
  // Item actions
  onItemClick?: (item: T) => void;
  onItemAction?: (itemId: string, action: string) => void;
  // Injected components
  ItemCardComponent?: React.ComponentType<any>;
  FiltersComponent?: React.ComponentType<any>;
  EmptyStateComponent?: React.ComponentType<{
    title: string;
    description: string;
  }>;
  CardGridComponent?: React.ComponentType<{ children: ReactNode }>;
  FormSelectComponent?: React.ComponentType<any>;
  // Notification callbacks
  onActionSuccess?: (message: string) => void;
  onActionError?: (message: string) => void;
  // Additional props
  className?: string;
  gridCols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * ResourceListing Component
 *
 * **Universal component** for displaying any resource type with filtering, sorting, and views.
 * Works for products, auctions, shops, categories, or any resource list.
 *
 * Features:
 * - Grid/list view toggle
 * - Filters sidebar (collapsible on mobile)
 * - Sort by multiple criteria
 * - Responsive layout
 * - Empty state handling
 * - Loading states
 * - Framework-independent with dependency injection
 *
 * @example
 * ```tsx
 * // For products
 * <ResourceListing
 *   items={products}
 *   resourceName="Products"
 *   ItemCardComponent={ProductCard}
 *   FiltersComponent={ProductFilters}
 *   sortOptions={[
 *     { value: 'price', label: 'Price' },
 *     { value: 'date', label: 'Date' }
 *   ]}
 *   onSortChange={handleSort}
 *   onFiltersChange={handleFilters}
 * />
 *
 * // For auctions
 * <ResourceListing
 *   items={auctions}
 *   resourceName="Auctions"
 *   ItemCardComponent={AuctionCard}
 *   FiltersComponent={AuctionFilters}
 * />
 * ```
 */
export function ResourceListing<T extends { id: string }>({
  items,
  loading = false,
  resourceName,
  resourceSingular,
  defaultView = "grid",
  showViewToggle = true,
  showFilters = true,
  showSort = true,
  sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "price", label: "Price" },
    { value: "name", label: "Name" },
  ],
  defaultSortBy = "createdAt",
  defaultSortOrder = "desc",
  onSortChange,
  filters = {},
  onFiltersChange,
  onItemClick,
  onItemAction,
  ItemCardComponent,
  FiltersComponent,
  EmptyStateComponent,
  CardGridComponent,
  FormSelectComponent,
  onActionSuccess,
  onActionError,
  className = "",
  gridCols = {
    default: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
}: ResourceListingProps<T>) {
  const [view, setView] = useState<"grid" | "list">(defaultView);
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [localFilters, setLocalFilters] =
    useState<ResourceListingFilters>(filters);

  const singular = resourceSingular || resourceName.slice(0, -1);

  // Default components (fallbacks)
  const DefaultCardGrid =
    CardGridComponent ||
    (({ children }: { children: ReactNode }) => {
      const gridClass = `grid gap-6 grid-cols-${gridCols.default || 1} ${
        gridCols.sm ? `sm:grid-cols-${gridCols.sm}` : ""
      } ${gridCols.md ? `md:grid-cols-${gridCols.md}` : ""} ${
        gridCols.lg ? `lg:grid-cols-${gridCols.lg}` : ""
      } ${gridCols.xl ? `xl:grid-cols-${gridCols.xl}` : ""}`;

      return <div className={gridClass}>{children}</div>;
    });

  const DefaultEmptyState =
    EmptyStateComponent ||
    (({ title, description }: { title: string; description: string }) => (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
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
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    ));

  const DefaultFormSelect =
    FormSelectComponent ||
    (({ value, onChange, options }: any) => (
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ));

  // Handlers
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange?.(value, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSortChange?.(sortBy, newOrder);
  };

  const handleFiltersChange = (newFilters: ResourceListingFilters) => {
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange?.(localFilters);
    setShowFiltersSidebar(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <DefaultCardGrid>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </DefaultCardGrid>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={className}>
        <DefaultEmptyState
          title={`No ${resourceName} Found`}
          description={`There are currently no ${resourceName.toLowerCase()} available. Check back later!`}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with View Toggle and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Count */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {items.length} {items.length === 1 ? singular : resourceName}
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile Filter Button */}
          {showFilters && FiltersComponent && (
            <button
              onClick={() => setShowFiltersSidebar(!showFiltersSidebar)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
            </button>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-2 ${
                  view === "grid"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                aria-label="Grid view"
              >
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
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-2 ${
                  view === "list"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                aria-label="List view"
              >
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Sort Controls */}
          {showSort && (
            <>
              <DefaultFormSelect
                value={sortBy}
                onChange={handleSortByChange}
                options={sortOptions}
              />
              <button
                onClick={handleSortOrderToggle}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                aria-label={`Sort ${
                  sortOrder === "asc" ? "ascending" : "descending"
                }`}
              >
                {sortOrder === "asc" ? (
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
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                ) : (
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
                      d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-6">
        {/* Filters Sidebar (Desktop) */}
        {showFilters && FiltersComponent && (
          <aside
            className={`
            ${showFiltersSidebar ? "block" : "hidden"} sm:block
            w-full sm:w-64 flex-shrink-0
          `}
          >
            <div className="sticky top-4">
              <FiltersComponent
                filters={localFilters}
                onChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>
        )}

        {/* Items Grid/List */}
        <div className="flex-1">
          {view === "grid" && ItemCardComponent ? (
            <DefaultCardGrid>
              {items.map((item) => (
                <ItemCardComponent
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick?.(item)}
                  onAction={(action: string) => onItemAction?.(item.id, action)}
                />
              ))}
            </DefaultCardGrid>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <ItemCardComponent
                  key={item.id}
                  item={item}
                  view="list"
                  onClick={() => onItemClick?.(item)}
                  onAction={(action: string) => onItemAction?.(item.id, action)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFiltersSidebar && showFilters && FiltersComponent && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowFiltersSidebar(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-900 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setShowFiltersSidebar(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FiltersComponent
                filters={localFilters}
                onChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
