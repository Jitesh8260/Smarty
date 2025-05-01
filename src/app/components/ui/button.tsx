// components/ui/Button.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className, ...props }) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-xl font-medium transition-all duration-200",
        variant === "primary"
          ? "bg-primary text-white hover:bg-primary/90"
          : "border border-input bg-background text-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
