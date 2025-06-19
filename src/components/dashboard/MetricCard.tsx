"use client"

import { Package, AlertTriangle, TrendingUp } from "lucide-react"
import { Card } from "@/components/common/Card"
import { useTheme } from "@/hooks/useTheme"
import { getIconBackground, getIconColor } from "@/utils/theme"
import type { MetricData } from "@/types"

interface MetricsCardProps {
    metric: MetricData
}

export function MetricsCard({ metric }: MetricsCardProps) {
    const { theme } = useTheme()

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "package":
                return Package
            case "alert-triangle":
                return AlertTriangle
            case "trending-up":
                return TrendingUp
            default:
                return Package
        }
    }

    const Icon = getIcon(metric.icon)

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getIconBackground(metric.color, theme)}`}>
                    <Icon className={`w-6 h-6 ${getIconColor(metric.color, theme)}`} />
                </div>
                <span
                    className={`text-sm flex items-center gap-1 ${
                        metric.changeType === "increase"
                            ? getIconColor("success", theme)
                            : theme === "dark"
                                ? "text-red-400"
                                : "text-red-600"
                    }`}
                >
          <TrendingUp className={`w-3 h-3 ${metric.changeType === "decrease" ? "rotate-180" : ""}`} />
                    {metric.changeType === "increase" ? "+" : ""}
                    {metric.change}
        </span>
            </div>
            <div className="text-3xl font-bold mb-1">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
        </Card>
    )
}
