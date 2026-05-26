import React from "react";

export type BadgeVariant = "light" | "solid";
export type BadgeSize = "sm" | "md";
export type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  size = "md",
  color = "primary",
  startIcon,
  endIcon,
  children,
}) => {
  const baseClasses =
    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium";

  const sizeClasses: Record<BadgeSize, string> = {
    sm: "text-xs",
    md: "text-sm",
  };

  const colorClasses: Record<BadgeVariant, Record<BadgeColor, string>> = {
    light: {
      primary:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      success:
        "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      error:
        "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
      warning:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
      info: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
      light: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80",
      dark: "bg-gray-600 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-blue-600 text-white",
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-cyan-600 text-white",
      light: "bg-gray-300 text-gray-900",
      dark: "bg-gray-800 text-white",
    },
  };

  const badgeClass = `${baseClasses} ${sizeClasses[size]} ${colorClasses[variant][color]}`;

  return (
    <span className={badgeClass}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
