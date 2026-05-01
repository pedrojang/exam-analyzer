"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "navy" | "orange";
type Size = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  default: "bg-navy text-white hover:bg-navy-600 shadow-sm",
  navy: "bg-[#0B1F4D] text-white hover:bg-[#091A42] shadow-sm",
  orange: "bg-[#F97316] text-white hover:bg-orange-600 shadow-sm",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm",
  ghost: "text-gray-700 hover:bg-gray-100",
  destructive: "bg-[#DC2626] text-white hover:bg-red-700 shadow-sm",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const sizeClasses: Record<Size, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B1F4D] disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
