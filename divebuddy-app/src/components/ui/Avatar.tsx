import React from "react";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name?: string;
  size?: number;
};

export default function Avatar({ name, size = 40, className = "", ...props }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DB";

  if (props.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        width={size}
        height={size}
        className={`inline-block h-${size} w-${size} rounded-full object-cover ${className}`}
        alt={name || "Avatar"}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center rounded-full bg-muted/30 text-sm font-medium text-foreground ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
