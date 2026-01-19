import React from "react";
import { cn } from "../../utils/cn";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  children: React.ReactNode;
}

const spacingClasses: Record<NonNullable<StackProps["spacing"]>, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignClasses: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

/**
 * Stack - Flex layout component with spacing and alignment
 *
 * Features:
 * - Row or column direction
 * - Consistent spacing between items
 * - Flexible alignment and justification
 * - Optional wrapping
 *
 * @example
 * <Stack direction="column" spacing="md" align="start">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 */
export const Stack: React.FC<StackProps> = ({
  direction = "column",
  spacing = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
