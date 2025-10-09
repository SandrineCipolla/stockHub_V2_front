"use client"

import {useEffect, useState} from "react"
import type {Theme, ThemeProviderProps} from "@/types"
import {ThemeContext} from "@/contexts/theme"

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>("dark")

    useEffect(() => {
        const savedTheme = localStorage.getItem("stockhub-theme") as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("stockhub-theme", theme)
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev: Theme) => (prev === "dark" ? "light" : "dark"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}