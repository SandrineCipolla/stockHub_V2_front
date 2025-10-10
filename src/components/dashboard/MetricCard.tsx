import React from 'react';
import {AlertTriangle, Package, TrendingUp} from 'lucide-react';
import CountUp from 'react-countup';
import {Card} from '@/components/common/Card';
import {useTheme} from '@/hooks/useTheme.ts';
import {useReducedMotion} from '@/hooks/useReducedMotion';
import type {IconComponentMap, MetricCardProps} from '@/types';

// Mapping des icônes avec typage strict
const iconMap: IconComponentMap = {
    'package': Package,
    'alert-triangle': AlertTriangle,
    'trending-up': TrendingUp,
};

export const MetricCard: React.FC<MetricCardProps> = ({
                                                          title,
                                                          value,
                                                          icon,
                                                          color,
                                                          change,
                                                          className = '',
                                                          enableAnimation = true
                                                      }) => {
    const { theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();
    const IconComponent = iconMap[icon];

    // Désactiver l'animation si explicitement demandé OU si reduced motion
    const shouldAnimate = enableAnimation && !prefersReducedMotion;

    // Parser la valeur pour extraire le nombre et les symboles (+ - %)
    const parseValue = (val: string | number): { number: number; prefix: string; suffix: string; isNumeric: boolean } => {
        const stringValue = String(val);

        // Si c'est déjà un nombre pur
        if (typeof val === 'number' || !isNaN(Number(val))) {
            return { number: Number(val), prefix: '', suffix: '', isNumeric: true };
        }

        // Extraire préfixe (+ ou -)
        const prefix = stringValue.match(/^[+-]/)?.[0] || '';

        // Extraire suffixe (% ou autres)
        const suffix = stringValue.match(/[%€$]$/)?.[0] || '';

        // Extraire le nombre
        const numberMatch = stringValue.match(/[+-]?[\d,\s]+\.?\d*/);
        const numberStr = numberMatch ? numberMatch[0].replace(/[,\s]/g, '') : '0';
        const number = parseFloat(numberStr) || 0;

        return { number: Math.abs(number), prefix, suffix, isNumeric: !prefix && !suffix };
    };

    const { number, prefix, suffix, isNumeric } = parseValue(value);

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
        <Card className={className} role="region">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`p-3 rounded-xl ${getIconBackground(color)}`}
                    aria-hidden="true"
                >
                    <IconComponent className={`w-6 h-6 ${getIconColor(color)}`} />
                </div>
                {change && (
                    <span
                        className={`text-sm flex items-center gap-1 ${getChangeColor(change.type)}`}
                        aria-label={`Évolution ${change.type === 'increase' ? 'positive' : 'négative'}: ${change.type === 'increase' ? '+' : '-'}${change.value}`}
                    >
          <TrendingUp
              className={`w-3 h-3 ${change.type === 'decrease' ? 'rotate-180' : ''}`}
              aria-hidden="true"
          />
                        {change.type === 'increase' ? '+' : '-'}{change.value}
        </span>
                )}
            </div>
            <div
                className="text-3xl font-bold mb-1"
                aria-label={`${title}: ${value}`}
            >
                {shouldAnimate ? (
                    <>
                        {prefix}
                        <CountUp
                            end={number}
                            duration={1.2}
                            decimals={number % 1 !== 0 ? 1 : 0}
                            separator={isNumeric ? ' ' : ''}
                            useEasing={true}
                            easingFn={(t: number, b: number, c: number, d: number) => {
                                // easeOutExpo pour un ralentissement progressif
                                return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                            }}
                        />
                        {suffix}
                    </>
                ) : (
                    value
                )}
            </div>
            <div className={`text-sm ${themeClasses.textSubtle}`}>
                {title}
            </div>
        </Card>
    );
};