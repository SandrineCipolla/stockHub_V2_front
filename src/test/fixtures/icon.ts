import {
    AlertTriangle,
    BarChart,
    Check,
    ChevronDown,
    ChevronRight,
    Download,
    Edit,
    Eye,
    LogOut,
    type LucideIcon,
    Package,
    Plus,
    Search,
    Settings,
    ShoppingCart,
    Trash2,
    User,
    X
} from 'lucide-react';

/**
 * Liste des noms d'icônes disponibles pour les tests
 */
type IconName =
    | 'add'
    | 'edit'
    | 'delete'
    | 'view'
    | 'download'
    | 'search'
    | 'chevronDown'
    | 'chevronRight'
    | 'close'
    | 'check'
    | 'warning'
    | 'user'
    | 'logout'
    | 'settings'
    | 'package'
    | 'cart'
    | 'chart';

/**
 * Collection d'icônes Lucide React typée strictement
 */
export const testIcons: Record<IconName, LucideIcon> = {
    // Actions principales
    add: Plus,
    edit: Edit,
    delete: Trash2,
    view: Eye,
    download: Download,
    search: Search,

    // Navigation
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
    close: X,

    // États
    check: Check,
    warning: AlertTriangle,

    // Utilisateur
    user: User,
    logout: LogOut,
    settings: Settings,

    // Métier StockHub
    package: Package,
    cart: ShoppingCart,
    chart: BarChart,
};

/**
 * Type exporté pour utilisation ailleurs
 */
export type TestIconName = IconName;