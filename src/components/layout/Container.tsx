import React from "react";
import { cn } from "../../utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  center?: boolean;
  children: React.ReactNode;
}

const maxWidthClasses: Record<
  NonNullable<ContainerProps["maxWidth"]>,
  string
> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const paddingClasses: Record<NonNullable<ContainerProps["padding"]>, string> = {
  none: "",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

/**
 * Container - Responsive max-width wrapper with padding
 *
 * Features:
 * - Multiple max-width variants
 * - Flexible padding options
 * - Auto centering
 * - Dark mode support
 *
 * @example
 * <Container maxWidth="lg" padding="md">
 *   <h1>Page Content</h1>
 * </Container>
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = "xl",
  padding = "md",
  center = true,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && "mx-auto",
        "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
