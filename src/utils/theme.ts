import type { Theme } from "@/types"

export const getThemeClasses = (theme: Theme) => ({
    background: theme === "dark" ? "bg-slate-900" : "bg-gray-50",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textMuted: theme === "dark" ? "text-gray-300" : "text-gray-600",
    textSubtle: theme === "dark" ? "text-gray-400" : "text-gray-500",
    card:
        theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white/80 border-gray-200 shadow-sm",
    cardHover:
        theme === "dark"
            ? "hover:bg-white/10 hover:border-purple-500/30"
            : "hover:bg-white hover:border-purple-300 hover:shadow-md",
    header: theme === "dark" ? "bg-slate-900/90 border-white/10" : "bg-white/95 border-gray-200",
    input:
        theme === "dark"
            ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    navSection:
        theme === "dark"
            ? "bg-gradient-to-r from-purple-900/30 to-purple-800/20"
            : "bg-gradient-to-r from-purple-100/80 to-purple-50",
    footer: theme === "dark" ? "border-white/10 bg-slate-900/50" : "border-gray-200 bg-gray-50/80",
})

export const getIconBackground = (type: "success" | "warning" | "info", theme: Theme) => {
    const backgrounds = {
        success: theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-100",
        warning: theme === "dark" ? "bg-amber-500/20" : "bg-amber-100",
        info: theme === "dark" ? "bg-blue-500/20" : "bg-blue-100",
    }
    return backgrounds[type]
}

export const getIconColor = (type: "success" | "warning" | "info", theme: Theme) => {
    const colors = {
        success: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
        warning: theme === "dark" ? "text-amber-400" : "text-amber-600",
        info: theme === "dark" ? "text-blue-400" : "text-blue-600",
    }
    return colors[type]
}
