"use client"

import type { ReactNode, ElementType, ButtonHTMLAttributes } from "react"
import type { ButtonVariant, ButtonSize } from "@/types"
import { useTheme } from "@/hooks/useTheme"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    children?: ReactNode
    icon?: ElementType
    className?: string
}

export function Button({
                           variant = "primary",
                           size = "md",
                           children,
                           icon: Icon,
                           className = "",
                           ...props
                       }: ButtonProps) {
    const { theme } = useTheme()

    const baseClasses =
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"

    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
        secondary:
            theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
        ghost:
            theme === "dark"
                ? "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white"
                : "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
        md: "px-4 py-2 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2",
    }

    return (
        <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    )
}
