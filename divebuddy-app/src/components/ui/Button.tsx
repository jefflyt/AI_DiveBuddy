"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    primary: "bg-foreground text-background hover:brightness-90",
    ghost: "border border-border bg-transparent text-foreground hover:bg-muted/10",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export default Button;
