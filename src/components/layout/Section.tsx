/**
 * Section Component
 * 
 * Semantic section wrapper with consistent spacing and styling.
 * Used for major page sections with optional backgrounds and borders.
 * 
 * Features:
 * - Semantic HTML5 <section> element
 * - Consistent vertical padding
 * - Optional background colors
 * - Dark mode support
 * - Responsive spacing
 * 
 * @example
 * ```tsx
 * <Section variant="default" spacing="lg">
 *   <Container>
 *     <Heading level={2}>Featured Products</Heading>
 *     <ProductGrid />
 *   </Container>
 * </Section>
 * ```
 */

import React from "react";
import { cn } from "../../utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual variant */
  variant?: "default" | "muted" | "accent" | "transparent";
  /** Vertical spacing */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Content children */
  children: React.ReactNode;
  /** HTML element to render as */
  as?: "section" | "div" | "article" | "main" | "aside";
}

const variantClasses: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "bg-white dark:bg-gray-900",
  muted: "bg-gray-50 dark:bg-gray-800",
  accent: "bg-indigo-50 dark:bg-indigo-900/20",
  transparent: "bg-transparent",
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-4 sm:py-6",
  md: "py-8 sm:py-12",
  lg: "py-12 sm:py-16",
  xl: "py-16 sm:py-24",
};

/**
 * Section - Semantic section wrapper with consistent spacing
 * 
 * Use for major page sections to maintain consistent vertical rhythm
 * and proper semantic HTML structure.
 */
export const Section: React.FC<SectionProps> = ({
  variant = "default",
  spacing = "md",
  children,
  as = "section",
  className,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={cn(
        variantClasses[variant],
        spacingClasses[spacing],
        "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
