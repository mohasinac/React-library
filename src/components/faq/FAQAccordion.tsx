/**
 * FAQAccordion - Enhanced FAQ Component with Category Filtering
 *
 * A comprehensive FAQ component that combines FAQItem and FAQSection with additional features:
 * - Category filtering with icons
 * - Search functionality
 * - Accordion behavior (single or multiple open)
 * - Custom styling and layout options
 * - Mobile responsive design
 * - Dark mode support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FAQAccordion
 *   faqs={[
 *     { id: "1", question: "How to buy?", answer: "...", category: "general" },
 *     { id: "2", question: "Shipping?", answer: "...", category: "shipping" }
 *   ]}
 * />
 *
 * // With category filter
 * <FAQAccordion
 *   faqs={faqs}
 *   categories={[
 *     { id: "general", name: "General", icon: "HelpCircle" },
 *     { id: "shipping", name: "Shipping", icon: "Truck" }
 *   ]}
 *   showCategoryFilter
 * />
 *
 * // Single open mode with search
 * <FAQAccordion
 *   faqs={faqs}
 *   singleOpen
 *   showSearch
 *   searchPlaceholder="Search questions..."
 * />
 * ```
 */

import * as Icons from "lucide-react";
import { useState } from "react";

export interface FAQItem {
  /** Unique identifier */
  id: string;
  /** Question text */
  question: string;
  /** Answer text (supports HTML) */
  answer: string;
  /** Category identifier */
  category?: string;
  /** Order/priority */
  order?: number;
}

export interface FAQCategory {
  /** Category identifier */
  id: string;
  /** Display name */
  name: string;
  /** Lucide icon name */
  icon?: string;
  /** Category description */
  description?: string;
}

export interface FAQAccordionProps {
  /** Array of FAQ items */
  faqs: FAQItem[];
  /** Array of categories */
  categories?: FAQCategory[];
  /** Show category filter tabs */
  showCategoryFilter?: boolean;
  /** Show search input */
  showSearch?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Only allow one FAQ open at a time */
  singleOpen?: boolean;
  /** Default open FAQ IDs */
  defaultOpenIds?: string[];
  /** Default selected category */
  defaultCategory?: string;
  /** Component title */
  title?: string;
  /** Component description */
  description?: string;
  /** Maximum number of items to display */
  maxItems?: number;
  /** Show "View All" link when maxItems is reached */
  showViewAll?: boolean;
  /** View All link URL */
  viewAllUrl?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom empty state message */
  emptyMessage?: string;
}

export function FAQAccordion({
  faqs,
  categories = [],
  showCategoryFilter = false,
  showSearch = false,
  searchPlaceholder = "Search FAQs...",
  singleOpen = false,
  defaultOpenIds = [],
  defaultCategory,
  title,
  description,
  maxItems,
  showViewAll = true,
  viewAllUrl = "/faq",
  className = "",
  emptyMessage = "No FAQs found. Try a different search term or category.",
}: FAQAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory || null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs by category
  let filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  // Filter by search query
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredFaqs = filteredFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery),
    );
  }

  // Sort by order if specified
  filteredFaqs = [...filteredFaqs].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });

  // Limit items if specified
  const displayedFaqs = maxItems
    ? filteredFaqs.slice(0, maxItems)
    : filteredFaqs;
  const hasMoreItems = maxItems && filteredFaqs.length > maxItems;

  // Toggle FAQ open/closed
  const toggleFaq = (id: string) => {
    if (singleOpen) {
      // Single open mode - close others
      setOpenIds(new Set(openIds.has(id) ? [] : [id]));
    } else {
      // Multiple open mode
      const newOpenIds = new Set(openIds);
      if (newOpenIds.has(id)) {
        newOpenIds.delete(id);
      } else {
        newOpenIds.add(id);
      }
      setOpenIds(newOpenIds);
    }
  };

  // Get Lucide icon component
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={category.description}
              >
                {category.icon && getIcon(category.icon)}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {displayedFaqs.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <Icons.HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          displayedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`${
                index !== displayedFaqs.length - 1
                  ? "border-b border-gray-200 dark:border-gray-700"
                  : ""
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full py-5 px-6 flex items-start justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={openIds.has(faq.id)}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="font-medium text-gray-900 dark:text-white flex-1">
                  {faq.question}
                </span>
                <Icons.ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIds.has(faq.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIds.has(faq.id) && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* View All Link */}
      {showViewAll && hasMoreItems && (
        <div className="text-center mt-6">
          <a
            href={viewAllUrl}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all {filteredFaqs.length} FAQs
            <Icons.ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
