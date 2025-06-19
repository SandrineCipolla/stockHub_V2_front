export type Theme = "dark" | "light"

export type StockStatus = "optimal" | "low" | "critical"

export interface Stock {
    id: number
    name: string
    quantity: number
    value: number
    status: StockStatus
    lastUpdate: string
    category?: string
    sku?: string
}

export interface MetricData {
    id: string
    label: string
    value: string | number
    change: number
    changeType: "increase" | "decrease"
    icon: string
    color: "success" | "warning" | "info"
}

export type ButtonVariant = "primary" | "secondary" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type BadgeVariant = "success" | "warning" | "danger"
