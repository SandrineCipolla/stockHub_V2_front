"use client"

import type { ReactNode } from "react"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

interface CardProps {
    children?: ReactNode
    hover?: boolean
    className?: string
    as?: 'div' | 'article' | 'section'  // ✅ AJOUTÉ : Élément sémantique
    'aria-labelledby'?: string  // ✅ AJOUTÉ pour accessibilité
    'aria-describedby'?: string  // ✅ AJOUTÉ pour accessibilité
}

export function Card({
                         children,
                         hover = true,
                         className = "",
                         as: Component = 'div',  // ✅ AJOUTÉ : Par défaut div
                         'aria-labelledby': ariaLabelledBy,
                         'aria-describedby': ariaDescribedBy,
                         ...props
                     }: CardProps) {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <Component
            className={`
                ${themeClasses.card} backdrop-blur-sm border rounded-xl p-6
                transition-all duration-300 will-change-transform
                ${hover ? `${themeClasses.cardHover} hover:-translate-y-1` : ""}
                ${className} ${themeClasses.text}
            `}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            {...props}
        >
            {children}
        </Component>
    )
}