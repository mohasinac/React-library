import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  colorScheme?:
    | "gray"
    | "blue"
    | "green"
    | "yellow"
    | "red"
    | "purple"
    | "orange"
    | "pink"
    | "indigo";
  variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
}

const colorSchemeClasses: Record<
  NonNullable<BadgeProps["colorScheme"]>,
  Record<NonNullable<BadgeProps["variant"]>, string>
> = {
  gray: {
    solid: "bg-gray-500 text-white",
    outline: "border-gray-500 text-gray-700 dark:text-gray-300",
    subtle: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  blue: {
    solid: "bg-blue-500 text-white",
    outline: "border-blue-500 text-blue-700 dark:text-blue-300",
    subtle: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  green: {
    solid: "bg-green-500 text-white",
    outline: "border-green-500 text-green-700 dark:text-green-300",
    subtle: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  yellow: {
    solid: "bg-yellow-500 text-white",
    outline: "border-yellow-500 text-yellow-700 dark:text-yellow-300",
    subtle:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  red: {
    solid: "bg-red-500 text-white",
    outline: "border-red-500 text-red-700 dark:text-red-300",
    subtle: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  purple: {
    solid: "bg-purple-500 text-white",
    outline: "border-purple-500 text-purple-700 dark:text-purple-300",
    subtle:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  orange: {
    solid: "bg-orange-500 text-white",
    outline: "border-orange-500 text-orange-700 dark:text-orange-300",
    subtle:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  pink: {
    solid: "bg-pink-500 text-white",
    outline: "border-pink-500 text-pink-700 dark:text-pink-300",
    subtle: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
  indigo: {
    solid: "bg-indigo-500 text-white",
    outline: "border-indigo-500 text-indigo-700 dark:text-indigo-300",
    subtle:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
};

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

/**
 * Badge - Status indicator with multiple variants and colors
 *
 * Features:
 * - Multiple color schemes
 * - Solid, outline, and subtle variants
 * - Three size options
 * - Dark mode support
 *
 * @example
 * <Badge colorScheme="blue" variant="solid">Active</Badge>
 * <Badge colorScheme="green" variant="outline" size="sm">New</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  colorScheme = "gray",
  variant = "solid",
  size = "md",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full",
        sizeClasses[size],
        colorSchemeClasses[colorScheme][variant],
        variant === "outline" && "border",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
