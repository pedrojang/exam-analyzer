import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "danger" | "navy";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#0B1F4D] text-white",
  navy: "bg-[#0B1F4D] text-white",
  secondary: "bg-gray-100 text-gray-700",
  destructive: "bg-[#DC2626] text-white",
  outline: "border border-gray-300 text-gray-700 bg-transparent",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
