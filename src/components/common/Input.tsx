"use client"

import type React from "react"

import type { InputHTMLAttributes } from "react"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType
}

export function Input({ icon: Icon, className = "", ...props }: InputProps) {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <div className="relative">
            {Icon && (
                <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSubtle}`} />
            )}
            <input
                className={`
          ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 w-full
          ${themeClasses.input} rounded-xl
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          transition-all
          ${className}
        `}
                {...props}
            />
        </div>
    )
}
