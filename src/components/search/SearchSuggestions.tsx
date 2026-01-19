/**
 * SearchSuggestions Component
 *
 * Displays live search suggestions in a dropdown as the user types.
 * Shows top 10 matches with keyboard navigation and click handling.
 *
 * @example
 * ```tsx
 * <SearchSuggestions
 *   query="phone"
 *   suggestions={[
 *     { id: "1", text: "iPhone 15", type: "product" },
 *     { id: "2", text: "Samsung Galaxy Phone", type: "product" },
 *   ]}
 *   onSelect={(suggestion) => navigate(`/search?q=${suggestion.text}`)}
 * />
 *
 * // With loading state
 * <SearchSuggestions
 *   query="laptop"
 *   suggestions={suggestions}
 *   isLoading={true}
 *   onSelect={handleSelect}
 * />
 *
 * // With custom rendering
 * <SearchSuggestions
 *   query="camera"
 *   suggestions={suggestions}
 *   onSelect={handleSelect}
 *   renderSuggestion={(suggestion) => (
 *     <CustomSuggestionItem suggestion={suggestion} />
 *   )}
 * />
 * ```
 */

import { useEffect, useRef, useState } from "react";

export interface SuggestionItem {
  /** Unique identifier for the suggestion */
  id: string;
  /** Display text for the suggestion */
  text: string;
  /** Type/category of the suggestion (product, shop, category, etc.) */
  type?: string;
  /** Optional icon or image URL */
  icon?: string;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

export interface SearchSuggestionsProps {
  /** Current search query */
  query: string;
  /** Array of suggestions (max 10 recommended) */
  suggestions: SuggestionItem[];
  /** Callback when a suggestion is selected */
  onSelect: (suggestion: SuggestionItem) => void;
  /** Whether suggestions are loading */
  isLoading?: boolean;
  /** Custom render function for each suggestion */
  renderSuggestion?: (suggestion: SuggestionItem) => React.ReactNode;
  /** Maximum number of suggestions to display */
  maxSuggestions?: number;
  /** Whether to show suggestion types */
  showTypes?: boolean;
  /** Whether to highlight matching text */
  highlightMatch?: boolean;
  /** Additional CSS classes for the dropdown */
  className?: string;
  /** Callback when dropdown should close */
  onClose?: () => void;
  /** Custom empty state message */
  emptyMessage?: string;
}

/** Default Search Icon (magnifying glass) */
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
      clipRule="evenodd"
    />
  </svg>
);

/** Highlight matching text in suggestion */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-white font-medium"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchSuggestions({
  query,
  suggestions,
  onSelect,
  isLoading = false,
  renderSuggestion,
  maxSuggestions = 10,
  showTypes = true,
  highlightMatch = true,
  className = "",
  onClose,
  emptyMessage = "No suggestions found",
}: SearchSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Limit suggestions to max count
  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!displayedSuggestions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < displayedSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : displayedSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSelect(displayedSuggestions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayedSuggestions, selectedIndex, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Don't render if no query
  if (!query) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden ${className}`}
      role="listbox"
      aria-label="Search suggestions"
    >
      {isLoading ? (
        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          <p className="mt-2 text-sm">Loading suggestions...</p>
        </div>
      ) : displayedSuggestions.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <SearchIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul ref={listRef} className="max-h-80 overflow-y-auto">
          {displayedSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === selectedIndex}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              } ${
                index !== displayedSuggestions.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700/50"
                  : ""
              }`}
              onClick={() => onSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {renderSuggestion ? (
                renderSuggestion(suggestion)
              ) : (
                <div className="flex items-center gap-3">
                  {suggestion.icon ? (
                    <img
                      src={suggestion.icon}
                      alt=""
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {highlightMatch
                        ? highlightText(suggestion.text, query)
                        : suggestion.text}
                    </div>
                    {showTypes && suggestion.type && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {suggestion.type}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
