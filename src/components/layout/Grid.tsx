import React from "react";
import { cn } from "../../utils/cn";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
  children: React.ReactNode;
}

const columnClasses: Record<NonNullable<GridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const responsiveColumnClasses: Record<
  NonNullable<GridProps["columns"]>,
  string
> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  12: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12",
};

const gapClasses: Record<NonNullable<GridProps["gap"]>, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/**
 * Grid - CSS Grid layout component with responsive columns
 *
 * Features:
 * - Fixed or responsive column layouts
 * - Consistent gap spacing
 * - Auto-flowing grid items
 * - Responsive breakpoints
 *
 * @example
 * <Grid columns={3} gap="md" responsive>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 */
export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = "md",
  responsive = true,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid",
        responsive ? responsiveColumnClasses[columns] : columnClasses[columns],
        gapClasses[gap],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
