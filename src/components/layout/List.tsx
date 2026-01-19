import React from "react";
import { cn } from "../../utils/cn";

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
  spacing?: "none" | "sm" | "md" | "lg";
  marker?: "default" | "none" | "disc" | "circle" | "decimal";
  children: React.ReactNode;
}

const spacingClasses: Record<NonNullable<ListProps["spacing"]>, string> = {
  none: "space-y-0",
  sm: "space-y-1",
  md: "space-y-2",
  lg: "space-y-4",
};

const markerClasses: Record<NonNullable<ListProps["marker"]>, string> = {
  default: "",
  none: "list-none",
  disc: "list-disc",
  circle: "list-circle",
  decimal: "list-decimal",
};

/**
 * List - Unordered or ordered list wrapper
 *
 * Features:
 * - Ordered (ol) or unordered (ul) lists
 * - Configurable spacing between items
 * - Multiple marker styles
 * - Default styling with padding
 *
 * @example
 * <List spacing="md">
 *   <ListItem>Item 1</ListItem>
 *   <ListItem>Item 2</ListItem>
 * </List>
 *
 * <List ordered marker="decimal">
 *   <ListItem>First</ListItem>
 *   <ListItem>Second</ListItem>
 * </List>
 */
export const List: React.FC<ListProps> = ({
  ordered = false,
  spacing = "md",
  marker = "default",
  children,
  className,
  ...props
}) => {
  const Tag = ordered ? "ol" : "ul";
  const defaultMarker = ordered ? "list-decimal" : "list-disc";
  const markerClass =
    marker === "default" ? defaultMarker : markerClasses[marker];

  return (
    <Tag
      className={cn(
        markerClass,
        spacingClasses[spacing],
        marker !== "none" && "pl-6",
        "text-gray-700 dark:text-gray-300",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

/**
 * ListItem - List item element
 *
 * @example
 * <ListItem>Item content</ListItem>
 */
export const ListItem: React.FC<ListItemProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  );
};
