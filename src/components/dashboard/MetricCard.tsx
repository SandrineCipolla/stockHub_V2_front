import React from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { useTheme } from '@/hooks/useTheme';


// Types pour les props du composant
interface MetricCardProps {
    id: string;
    label: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease';
    icon: 'package' | 'alert-triangle' | 'trending-up';
    color: 'success' | 'warning' | 'info';
    className?: string;
}

// Mapping des icônes
const iconMap = {
    'package': Package,
    'alert-triangle': AlertTriangle,
    'trending-up': TrendingUp,
} as const;

export const MetricCard: React.FC<MetricCardProps> = ({
                                                          id,
                                                          label,
                                                          value,
                                                          change,
                                                          changeType,
                                                          icon,
                                                          color,
                                                          className = ''
                                                      }) => {
    const { theme } = useTheme();
    const IconComponent = iconMap[icon];

    // Fonctions utilitaires pour les styles
    const getIconBackground = (type: 'success' | 'warning' | 'info'): string => {
        const backgrounds = {
            success: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            warning: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100',
            info: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
        };
        return backgrounds[type];
    };

    const getIconColor = (type: 'success' | 'warning' | 'info'): string => {
        const colors = {
            success: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
            warning: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
            info: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        };
        return colors[type];
    };

    const getChangeColor = (type: 'increase' | 'decrease'): string => {
        if (type === 'increase') {
            return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
        }
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    };

    const themeClasses = {
        textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    return (
        <Card className={className} aria-labelledby={id || undefined} role="region">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`p-3 rounded-xl ${getIconBackground(color)}`}
                    aria-hidden="true"
                >
                    <IconComponent className={`w-6 h-6 ${getIconColor(color)}`} />
                </div>
                <span
                    className={`text-sm flex items-center gap-1 ${getChangeColor(changeType)}`}
                    aria-label={`Évolution ${changeType === 'increase' ? 'positive' : 'négative'}: ${changeType === 'increase' ? '+' : '-'}${change}`}
                >
          <TrendingUp
              className={`w-3 h-3 ${changeType === 'decrease' ? 'rotate-180' : ''}`}
              aria-hidden="true"
          />
                    {changeType === 'increase' ? '+' : '-'}{change}
        </span>
            </div>
            <div
                className="text-3xl font-bold mb-1"
                id={id}
                aria-label={`${label}: ${value}`}
            >
                {value}
            </div>
            <div className={`text-sm ${themeClasses.textSubtle}`}>
                {label}
            </div>
        </Card>
    );
};