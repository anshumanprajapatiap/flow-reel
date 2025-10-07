import React from "react";
import clsx from "clsx";

/**
 * Simple reusable Button component.
 * 
 * Props:
 * - variant: "default" | "secondary" | "destructive" | "ghost"
 * - size: "sm" | "md" | "lg"
 * - className: extra custom classes
 */
export function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-400",
    destructive:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost:
      "bg-transparent hover:bg-gray-800 text-gray-200 focus:ring-gray-600",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
