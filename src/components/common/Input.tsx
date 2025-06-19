
"use client"

import type React from "react"
import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void  // ✅ AJOUTÉ
}

// ✅ MODIFIÉ : Ajout de forwardRef pour supporter les références
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ icon: Icon, className = "", onKeyDown, ...props }, ref) => {
        const { theme } = useTheme()
        const themeClasses = getThemeClasses(theme)

        return (
            <div className="relative">
                {Icon && (
                    <Icon
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSubtle}`}
                        aria-hidden="true"  // ✅ AJOUTÉ pour accessibilité
                    />
                )}
                <input
                    ref={ref}  // ✅ AJOUTÉ
                    onKeyDown={onKeyDown}  // ✅ AJOUTÉ
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
)

// ✅ AJOUTÉ : Nom d'affichage pour React DevTools
Input.displayName = 'Input'
