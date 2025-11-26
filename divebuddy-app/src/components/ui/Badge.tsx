import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning";
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-muted/10 text-muted",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;
