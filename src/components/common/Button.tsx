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
    "aria-label"?: string  // ✅ MODIFIÉ : Rendu optionnel
    "aria-describedby"?: string  // ✅ AJOUTÉ pour descriptions étendues
    isLoading?: boolean  // ✅ AJOUTÉ pour états de chargement
}

export function Button({
                           variant = "primary",
                           size = "md",
                           children,
                           icon: Icon,
                           className = "",
                           "aria-label": ariaLabel,
                           "aria-describedby": ariaDescribedBy,
                           isLoading = false,
                           disabled,
                           ...props
                       }: ButtonProps) {
    const { theme } = useTheme()

    const baseClasses =
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"  // ✅ AJOUTÉ styles disabled

    // ✅ AMÉLIORÉ : Contrastes optimisés pour RGAA
    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg disabled:hover:bg-purple-600",
        secondary:
            theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20"  // ✅ AMÉLIORÉ: text-gray-200 au lieu de text-white
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300",  // ✅ AMÉLIORÉ: text-gray-800
        ghost:
            theme === "dark"
                ? "bg-transparent hover:bg-white/10 text-gray-200 hover:text-white"  // ✅ AMÉLIORÉ: text-gray-200
                : "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900",  // ✅ AMÉLIORÉ: text-gray-700
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
        md: "px-4 py-2 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2",
    }

    // ✅ AMÉLIORÉ : Gestion du disabled et loading
    const isDisabled = disabled || isLoading

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-disabled={isDisabled}  // ✅ AJOUTÉ pour accessibilité
            disabled={isDisabled}
            {...props}
        >
            {/* ✅ AJOUTÉ : Indicateur de chargement accessible */}
            {isLoading && (
                <>
                    <span className="sr-only">Chargement en cours</span>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </>
            )}
            {/* ✅ AMÉLIORÉ : Icône avec aria-hidden */}
            {Icon && !isLoading && <Icon className="w-4 h-4" aria-hidden="true" />}
            {children}
        </button>
    )
}