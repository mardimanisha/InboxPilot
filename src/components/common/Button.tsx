import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const base = "rounded-full font-medium focus:outline-none transition-all";
const variants = {
  solid: "bg-gray-900 text-white",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  ghost: "text-gray-600 hover:text-gray-900",
};
const sizes = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-lg px-6 py-3",
};

export function Button({ variant = "solid", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}