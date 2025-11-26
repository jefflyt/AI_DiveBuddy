import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label ? <label className="text-sm text-muted">{label}</label> : null}
      <input
        className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        {...props}
      />
    </div>
  );
}

export default Input;
