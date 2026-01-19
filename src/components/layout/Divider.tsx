import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
  color?: "default" | "light" | "dark";
}

const orientationClasses: Record<
  NonNullable<DividerProps["orientation"]>,
  string
> = {
  horizontal: "w-full h-px",
  vertical: "w-px h-full",
};

const spacingClasses: Record<
  NonNullable<DividerProps["orientation"]>,
  Record<NonNullable<DividerProps["spacing"]>, string>
> = {
  horizontal: {
    none: "",
    sm: "my-2",
    md: "my-4",
    lg: "my-8",
  },
  vertical: {
    none: "",
    sm: "mx-2",
    md: "mx-4",
    lg: "mx-8",
  },
};

const colorClasses: Record<NonNullable<DividerProps["color"]>, string> = {
  default: "bg-gray-200 dark:bg-gray-700",
  light: "bg-gray-100 dark:bg-gray-800",
  dark: "bg-gray-300 dark:bg-gray-600",
};

/**
 * Divider - Horizontal or vertical separator line
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Configurable spacing
 * - Multiple color variants
 * - Dark mode support
 *
 * @example
 * <Divider spacing="md" />
 * <Divider orientation="vertical" />
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  spacing = "md",
  color = "default",
  className,
  ...props
}) => {
  return (
    <hr
      className={cn(
        orientationClasses[orientation],
        spacingClasses[orientation][spacing],
        colorClasses[color],
        "border-0",
        className,
      )}
      {...props}
    />
  );
};
