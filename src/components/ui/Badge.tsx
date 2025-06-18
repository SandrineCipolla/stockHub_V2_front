import React, {JSX} from 'react';
import { BadgeVariant, StockStatus } from '../../types';
import { getBadgeClasses } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps {
    variant: BadgeVariant;
    children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
    const { theme } = useTheme();
    const badgeClasses = getBadgeClasses(variant, theme);

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeClasses}`}>
      {children}
    </span>
    );
};

// Utilitaire pour obtenir le badge approprié en fonction du statut du stock
export const getStatusBadge = (status: StockStatus): JSX.Element => {
    const statusMap: Record<StockStatus, { variant: BadgeVariant; label: string }> = {
        optimal: { variant: "success", label: "Optimal" },
        low: { variant: "warning", label: "Faible" },
        critical: { variant: "danger", label: "Critique" },
    };

    const { variant, label } = statusMap[status];
    return <Badge variant={variant}>{label}</Badge>;
};

export default Badge;