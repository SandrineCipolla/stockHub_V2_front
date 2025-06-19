"use client"

import type { ReactNode } from "react"
import type { BadgeVariant } from "@/types"
import { useTheme } from "@/hooks/useTheme"

interface BadgeProps {
    variant: BadgeVariant
    children?: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
    const { theme } = useTheme()

    const variants = {
        success:
            theme === "dark"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                : "bg-emerald-100 text-emerald-800 border-emerald-300",
        warning:
            theme === "dark"
                ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                : "bg-amber-100 text-amber-800 border-amber-300",
        danger:
            theme === "dark" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-800 border-red-300",
    }

    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`} role="status"
    >{children}</span>
}
