"use client"

import type { ReactNode } from "react"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

interface CardProps {
    children?: ReactNode
    hover?: boolean
    className?: string
}

export function Card({ children, hover = true, className = "" }: CardProps) {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <div
            className={`
        ${themeClasses.card} backdrop-blur-sm border rounded-xl p-6
        transition-all duration-300
        ${hover ? `${themeClasses.cardHover} hover:-translate-y-1` : ""}
        ${className} ${themeClasses.text}
      `}
        >
            {children}
        </div>
    )
}
