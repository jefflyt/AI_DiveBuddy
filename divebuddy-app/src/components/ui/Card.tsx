import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

export function Card({ as: Component = "div", className = "", children, ...props }: CardProps) {
  return (
    <Component className={`rounded-lg border border-border bg-card p-4 ${className}`} {...props}>
      {children}
    </Component>
  );
}

export default Card;
