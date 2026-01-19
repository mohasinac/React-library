/**
 * Wrapper Component
 * 
 * Generic wrapper component for grouping content with optional styling.
 * More flexible than Container, without max-width constraints.
 * 
 * Features:
 * - Flexible layout direction (horizontal/vertical)
 * - Optional padding and gap
 * - Alignment control
 * - Dark mode support
 * - Can be used for flexbox or grid layouts
 * 
 * @example
 * ```tsx
 * <Wrapper direction="vertical" gap="md" align="center">
 *   <Heading level={2}>Title</Heading>
 *   <Text>Description</Text>
 *   <Button>Action</Button>
 * </Wrapper>
 * ```
 */

import React from "react";
import { cn } from "../../utils/cn";

export interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Gap between children */
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify content */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Whether to wrap items */
  wrap?: boolean;
  /** Content children */
  children: React.ReactNode;
  /** HTML element to render as */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "nav";
}

const directionClasses: Record<
  NonNullable<WrapperProps["direction"]>,
  string
> = {
  horizontal: "flex-row",
  vertical: "flex-col",
};

const gapClasses: Record<NonNullable<WrapperProps["gap"]>, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignClasses: Record<NonNullable<WrapperProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses: Record<NonNullable<WrapperProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const paddingClasses: Record<NonNullable<WrapperProps["padding"]>, string> = {
  none: "",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

/**
 * Wrapper - Flexible layout container
 * 
 * Use for grouping content with flexbox layout. More flexible than
 * Container component as it doesn't enforce max-width.
 */
export const Wrapper: React.FC<WrapperProps> = ({
  direction = "vertical",
  gap = "none",
  align = "stretch",
  justify = "start",
  padding = "none",
  wrap = false,
  children,
  as = "div",
  className,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={cn(
        "flex",
        directionClasses[direction],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        paddingClasses[padding],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
