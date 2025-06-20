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
//
// import type { Theme, ColorType } from '@/types';
//
// // ===== TYPES POUR LES CLASSES DE THÈME =====
// export interface ThemeClasses {
//     readonly background: string;
//     readonly text: string;
//     readonly textMuted: string;
//     readonly textSubtle: string;
//     readonly card: string;
//     readonly cardHover: string;
//     readonly header: string;
//     readonly input: string;
//     readonly navSection: string;
//     readonly footer: string;
//     readonly border: string;
//     readonly accent: string;
// }
//
// export interface ColorClasses {
//     readonly background: string;
//     readonly text: string;
//     readonly border: string;
//     readonly hover: string;
// }
//
// // ===== CONSTANTES TYPÉES =====
// const LIGHT_THEME_CLASSES: ThemeClasses = {
//     background: 'bg-gray-50',
//     text: 'text-gray-900',
//     textMuted: 'text-gray-700',
//     textSubtle: 'text-gray-600',
//     card: 'bg-white/80 border-gray-200 shadow-sm',
//     cardHover: 'hover:bg-white hover:border-purple-300 hover:shadow-md',
//     header: 'bg-white/95 border-gray-200',
//     input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
//     navSection: 'bg-gradient-to-r from-purple-100/80 to-purple-50',
//     footer: 'border-gray-200 bg-gray-50/80',
//     border: 'border-gray-200',
//     accent: 'text-purple-600'
// } as const;
//
// const DARK_THEME_CLASSES: ThemeClasses = {
//     background: 'bg-slate-900',
//     text: 'text-white',
//     textMuted: 'text-gray-200',
//     textSubtle: 'text-gray-300',
//     card: 'bg-white/5 border-white/10',
//     cardHover: 'hover:bg-white/10 hover:border-purple-500/30',
//     header: 'bg-slate-900/90 border-white/10',
//     input: 'bg-white/10 border-white/20 text-white placeholder-gray-300',
//     navSection: 'bg-gradient-to-r from-purple-900/30 to-purple-800/20',
//     footer: 'border-white/10 bg-slate-900/50',
//     border: 'border-white/10',
//     accent: 'text-purple-400'
// } as const;
//
// // ===== FONCTION PRINCIPALE =====
// export const getThemeClasses = (theme: Theme): ThemeClasses => {
//     return theme === 'dark' ? DARK_THEME_CLASSES : LIGHT_THEME_CLASSES;
// };
//
// // ===== COULEURS PAR TYPE =====
// const COLOR_CLASSES = {
//     success: {
//         dark: {
//             background: 'bg-emerald-500/20',
//             text: 'text-emerald-300',
//             border: 'border-emerald-400/50',
//             hover: 'hover:bg-emerald-500/30'
//         },
//         light: {
//             background: 'bg-emerald-100',
//             text: 'text-emerald-800',
//             border: 'border-emerald-300',
//             hover: 'hover:bg-emerald-200'
//         }
//     },
//     warning: {
//         dark: {
//             background: 'bg-amber-500/20',
//             text: 'text-amber-300',
//             border: 'border-amber-400/50',
//             hover: 'hover:bg-amber-500/30'
//         },
//         light: {
//             background: 'bg-amber-100',
//             text: 'text-amber-800',
//             border: 'border-amber-300',
//             hover: 'hover:bg-amber-200'
//         }
//     },
//     danger: {
//         dark: {
//             background: 'bg-red-500/20',
//             text: 'text-red-300',
//             border: 'border-red-400/50',
//             hover: 'hover:bg-red-500/30'
//         },
//         light: {
//             background: 'bg-red-100',
//             text: 'text-red-800',
//             border: 'border-red-300',
//             hover: 'hover:bg-red-200'
//         }
//     },
//     info: {
//         dark: {
//             background: 'bg-blue-500/20',
//             text: 'text-blue-300',
//             border: 'border-blue-400/50',
//             hover: 'hover:bg-blue-500/30'
//         },
//         light: {
//             background: 'bg-blue-100',
//             text: 'text-blue-800',
//             border: 'border-blue-300',
//             hover: 'hover:bg-blue-200'
//         }
//     }
// } as const;
//
// // ===== FONCTIONS UTILITAIRES =====
// export const getIconBackground = (color: ColorType, theme: Theme): string => {
//     return COLOR_CLASSES[color][theme].background;
// };
//
// export const getIconColor = (color: ColorType, theme: Theme): string => {
//     return COLOR_CLASSES[color][theme].text;
// };
//
// export const getBorderColor = (color: ColorType, theme: Theme): string => {
//     return COLOR_CLASSES[color][theme].border;
// };
//
// export const getHoverColor = (color: ColorType, theme: Theme): string => {
//     return COLOR_CLASSES[color][theme].hover;
// };
//
// // ===== VALIDATION TYPÉE =====
// export const isValidTheme = (theme: string): theme is Theme => {
//     return theme === 'light' || theme === 'dark';
// };
//
// export const isValidColorType = (color: string): color is ColorType => {
//     return ['success', 'warning', 'danger', 'info'].includes(color);
// };
//
// // ===== UTILITAIRES DE CONVERSION =====
// export const getContrastText = (theme: Theme): string => {
//     return theme === 'dark' ? 'text-white' : 'text-gray-900';
// };
//
// export const getContrastBackground = (theme: Theme): string => {
//     return theme === 'dark' ? 'bg-slate-900' : 'bg-white';
// };
//
// // ===== CLASSES POUR COMPOSANTS SPÉCIFIQUES =====
// export const getButtonClasses = (theme: Theme) => ({
//     primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg disabled:hover:bg-purple-600',
//     secondary: theme === 'dark'
//         ? 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20'
//         : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
//     ghost: theme === 'dark'
//         ? 'bg-transparent hover:bg-white/10 text-gray-200 hover:text-white'
//         : 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'
// });
//
// export const getInputClasses = (theme: Theme) => ({
//     base: theme === 'dark'
//         ? 'bg-white/10 border-white/20 text-white placeholder-gray-300'
//         : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
//     focus: 'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
//     error: theme === 'dark'
//         ? 'border-red-400/50 focus:ring-red-400/50'
//         : 'border-red-300 focus:ring-red-300',
//     success: theme === 'dark'
//         ? 'border-emerald-400/50 focus:ring-emerald-400/50'
//         : 'border-emerald-300 focus:ring-emerald-300'
// });
//
// // ===== ANIMATIONS ET TRANSITIONS =====
// export const getTransitionClasses = () => ({
//     fast: 'transition-all duration-150 ease-in-out',
//     normal: 'transition-all duration-300 ease-in-out',
//     slow: 'transition-all duration-500 ease-in-out',
//     bounce: 'transition-transform duration-200 ease-out hover:scale-105 active:scale-95'
// });
//
// // ===== SHADOWS PAR THÈME =====
// export const getShadowClasses = (theme: Theme) => ({
//     sm: theme === 'dark' ? 'shadow-lg shadow-black/20' : 'shadow-sm',
//     md: theme === 'dark' ? 'shadow-xl shadow-black/30' : 'shadow-md',
//     lg: theme === 'dark' ? 'shadow-2xl shadow-black/40' : 'shadow-lg',
//     inner: theme === 'dark' ? 'shadow-inner shadow-black/30' : 'shadow-inner'
// });
//
// // ===== RESPONSIVE BREAKPOINTS TYPÉS =====
// export const BREAKPOINTS = {
//     sm: '640px',
//     md: '768px',
//     lg: '1024px',
//     xl: '1280px',
//     '2xl': '1536px'
// } as const;
//
// export type Breakpoint = keyof typeof BREAKPOINTS;
//
// // ===== CLASSES RESPONSIVE =====
// export const getResponsiveClasses = () => ({
//     container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
//     grid: {
//         auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
//         responsive: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6',
//         metrics: 'grid grid-cols-1 md:grid-cols-3 gap-6'
//     },
//     flex: {
//         responsive: 'flex flex-col lg:flex-row lg:items-center lg:justify-between',
//         center: 'flex items-center justify-center',
//         between: 'flex items-center justify-between'
//     }
// });
//
// // ===== EXPORT DES TYPES ET CONSTANTES =====
// export type { ThemeClasses, ColorClasses };
//
// // ===== CONFIGURATION THÈME COMPLÈTE =====
// export interface ThemeConfig {
//     colors: Record<ColorType, { light: ColorClasses; dark: ColorClasses }>;
//     typography: {
//         fontFamily: string;
//         fontSize: Record<string, string>;
//         fontWeight: Record<string, string>;
//     };
//     spacing: Record<string, string>;
//     borderRadius: Record<string, string>;
//     shadows: Record<string, string>;
// }
//
// export const THEME_CONFIG: ThemeConfig = {
//     colors: COLOR_CLASSES,
//     typography: {
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//         fontSize: {
//             xs: '0.75rem',
//             sm: '0.875rem',
//             base: '1rem',
//             lg: '1.125rem',
//             xl: '1.25rem',
//             '2xl': '1.5rem',
//             '3xl': '1.875rem'
//         },
//         fontWeight: {
//             normal: '400',
//             medium: '500',
//             semibold: '600',
//             bold: '700'
//         }
//     },
//     spacing: {
//         xs: '0.25rem',
//         sm: '0.5rem',
//         md: '0.75rem',
//         lg: '1rem',
//         xl: '1.5rem',
//         '2xl': '2rem',
//         '3xl': '3rem'
//     },
//     borderRadius: {
//         sm: '0.375rem',
//         md: '0.5rem',
//         lg: '0.75rem',
//         xl: '1rem',
//         full: '9999px'
//     },
//     shadows: {
//         sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
//         md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//         lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
//         xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
//     }
// };