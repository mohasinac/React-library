/**
 * SEOFieldsGroup - SEO Form Fields Component
 *
 * A comprehensive form group for SEO-related fields including:
 * - SEO Title with character counter
 * - SEO Description with character counter
 * - SEO Keywords (comma-separated tags)
 * - URL Slug with auto-generation
 * - Real-time validation and recommendations
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SEOFieldsGroup
 *   values={{
 *     seoTitle: "Product Title",
 *     seoDescription: "Product description...",
 *     seoKeywords: ["keyword1", "keyword2"],
 *     slug: "product-title"
 *   }}
 *   onChange={(field, value) => setFieldValue(field, value)}
 * />
 *
 * // With auto-slug generation
 * <SEOFieldsGroup
 *   values={values}
 *   onChange={handleChange}
 *   baseTitle="My Product Name"
 *   autoGenerateSlug
 * />
 *
 * // With validation errors
 * <SEOFieldsGroup
 *   values={values}
 *   onChange={handleChange}
 *   errors={{
 *     seoTitle: "Title is too short",
 *     slug: "Slug already exists"
 *   }}
 * />
 * ```
 */

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export interface SEOFieldsValues {
  /** SEO page title (recommended: 50-60 characters) */
  seoTitle?: string;
  /** SEO meta description (recommended: 150-160 characters) */
  seoDescription?: string;
  /** SEO keywords (array of strings) */
  seoKeywords?: string[];
  /** URL slug (auto-generated if not provided) */
  slug?: string;
}

export interface SEOFieldsErrors {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  slug?: string;
}

export interface SEOFieldsGroupProps {
  /** Current SEO field values */
  values: SEOFieldsValues;
  /** Callback when a field changes */
  onChange: (field: keyof SEOFieldsValues, value: string | string[]) => void;
  /** Validation errors for each field */
  errors?: SEOFieldsErrors;
  /** Base title for auto-generating SEO title and slug */
  baseTitle?: string;
  /** Auto-generate slug from title */
  autoGenerateSlug?: boolean;
  /** Show character count recommendations */
  showRecommendations?: boolean;
  /** Show collapsible section */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

// Recommended character limits
const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

// Generate URL slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .substring(0, 100); // Limit length
}

// Get character count status
function getCountStatus(
  length: number,
  min: number,
  max: number
): "good" | "warning" | "error" {
  if (length === 0) return "error";
  if (length < min) return "warning";
  if (length > max) return "error";
  return "good";
}

export function SEOFieldsGroup({
  values,
  onChange,
  errors,
  baseTitle,
  autoGenerateSlug = true,
  showRecommendations = true,
  collapsible = true,
  defaultCollapsed = false,
  title = "SEO Settings",
  description = "Optimize your content for search engines",
  className = "",
}: SEOFieldsGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [keywordInput, setKeywordInput] = useState("");

  // Auto-generate SEO title from base title if not set
  useEffect(() => {
    if (baseTitle && !values.seoTitle) {
      onChange("seoTitle", baseTitle);
    }
  }, [baseTitle, values.seoTitle, onChange]);

  // Auto-generate slug from SEO title
  useEffect(() => {
    if (autoGenerateSlug && values.seoTitle && !values.slug) {
      const newSlug = generateSlug(values.seoTitle);
      onChange("slug", newSlug);
    }
  }, [autoGenerateSlug, values.seoTitle, values.slug, onChange]);

  // Handle keyword input (comma or Enter to add)
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const keyword = keywordInput.trim();
      if (keyword && !(values.seoKeywords || []).includes(keyword)) {
        onChange("seoKeywords", [...(values.seoKeywords || []), keyword]);
        setKeywordInput("");
      }
    }
  };

  // Remove keyword
  const removeKeyword = (keyword: string) => {
    onChange(
      "seoKeywords",
      (values.seoKeywords || []).filter((k) => k !== keyword)
    );
  };

  // Character counts
  const titleLength = values.seoTitle?.length || 0;
  const descLength = values.seoDescription?.length || 0;
  const titleStatus = getCountStatus(titleLength, TITLE_MIN, TITLE_MAX);
  const descStatus = getCountStatus(descLength, DESC_MIN, DESC_MAX);

  const StatusIcon = ({ status }: { status: "good" | "warning" | "error" }) => {
    if (status === "good")
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "warning")
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {collapsible && (
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label={isCollapsed ? "Expand" : "Collapse"}
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="seoTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                SEO Title
              </label>
              {showRecommendations && (
                <div className="flex items-center gap-2 text-xs">
                  <StatusIcon status={titleStatus} />
                  <span
                    className={`${
                      titleStatus === "good"
                        ? "text-green-600 dark:text-green-400"
                        : titleStatus === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {titleLength}/{TITLE_MAX} characters
                  </span>
                </div>
              )}
            </div>
            <input
              id="seoTitle"
              type="text"
              value={values.seoTitle || ""}
              onChange={(e) => onChange("seoTitle", e.target.value)}
              placeholder="Enter SEO title (50-60 characters recommended)"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors?.seoTitle
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors?.seoTitle && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.seoTitle}
              </p>
            )}
            {showRecommendations && titleLength > 0 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {titleLength < TITLE_MIN
                  ? `Add ${TITLE_MIN - titleLength} more characters for optimal length`
                  : titleLength > TITLE_MAX
                    ? `Reduce by ${titleLength - TITLE_MAX} characters`
                    : "Perfect length for search results"}
              </p>
            )}
          </div>

          {/* SEO Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="seoDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                SEO Description
              </label>
              {showRecommendations && (
                <div className="flex items-center gap-2 text-xs">
                  <StatusIcon status={descStatus} />
                  <span
                    className={`${
                      descStatus === "good"
                        ? "text-green-600 dark:text-green-400"
                        : descStatus === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {descLength}/{DESC_MAX} characters
                  </span>
                </div>
              )}
            </div>
            <textarea
              id="seoDescription"
              value={values.seoDescription || ""}
              onChange={(e) => onChange("seoDescription", e.target.value)}
              placeholder="Enter SEO description (150-160 characters recommended)"
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors?.seoDescription
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors?.seoDescription && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.seoDescription}
              </p>
            )}
            {showRecommendations && descLength > 0 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {descLength < DESC_MIN
                  ? `Add ${DESC_MIN - descLength} more characters`
                  : descLength > DESC_MAX
                    ? `Reduce by ${descLength - DESC_MAX} characters`
                    : "Perfect length for meta description"}
              </p>
            )}
          </div>

          {/* SEO Keywords */}
          <div>
            <label
              htmlFor="seoKeywords"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              SEO Keywords
            </label>
            <div className="space-y-2">
              {/* Keyword Tags */}
              {(values.seoKeywords || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(values.seoKeywords || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label={`Remove ${keyword}`}
                      >
                        <svg
                          className="w-4 h-4"
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
                    </span>
                  ))}
                </div>
              )}
              {/* Keyword Input */}
              <input
                id="seoKeywords"
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type keyword and press Enter or comma"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors?.seoKeywords
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {errors?.seoKeywords && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.seoKeywords}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Press Enter or comma to add multiple keywords
            </p>
          </div>

          {/* URL Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              URL Slug
            </label>
            <div className="flex gap-2">
              <input
                id="slug"
                type="text"
                value={values.slug || ""}
                onChange={(e) => onChange("slug", e.target.value.toLowerCase())}
                placeholder="url-friendly-slug"
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                  errors?.slug
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {autoGenerateSlug && values.seoTitle && (
                <button
                  type="button"
                  onClick={() =>
                    onChange("slug", generateSlug(values.seoTitle || ""))
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Generate
                </button>
              )}
            </div>
            {errors?.slug && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.slug}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
