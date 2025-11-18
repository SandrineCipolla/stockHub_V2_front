export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

// Liens de navigation principaux
export const mockNavigationLinks: NavigationLink[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    href: '/dashboard',
    icon: 'dashboard',
    isActive: true,
  },
  {
    id: 'stocks',
    label: 'Actions',
    href: '/stocks',
    icon: 'trending_up',
    isActive: false,
  },
  {
    id: 'portfolio',
    label: 'Portefeuille',
    href: '/portfolio',
    icon: 'account_balance_wallet',
    isActive: false,
  },
  {
    id: 'analytics',
    label: 'Analyses',
    href: '/analytics',
    icon: 'analytics',
    isActive: false,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    href: '/settings',
    icon: 'settings',
    isActive: false,
  },
];

// Breadcrumbs pour différentes pages
export const mockBreadcrumbs = {
  dashboard: [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'dashboard', label: 'Tableau de bord', isActive: true },
  ] as BreadcrumbItem[],

  stocks: [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'stocks', label: 'Actions', isActive: true },
  ] as BreadcrumbItem[],

  stockDetail: [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'stocks', label: 'Actions', href: '/stocks' },
    { id: 'stock-detail', label: 'AAPL', isActive: true },
  ] as BreadcrumbItem[],

  portfolio: [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'portfolio', label: 'Portefeuille', isActive: true },
  ] as BreadcrumbItem[],
};

// Navigation secondaire
export const mockSecondaryNavigation: NavigationLink[] = [
  {
    id: 'profile',
    label: 'Profil',
    href: '/profile',
    icon: 'person',
  },
  {
    id: 'help',
    label: 'Aide',
    href: '/help',
    icon: 'help',
  },
  {
    id: 'logout',
    label: 'Déconnexion',
    href: '/logout',
    icon: 'logout',
  },
];

// Navigation avec différents états
export const mockNavigationStates = {
  default: mockNavigationLinks,

  withActiveStocks: mockNavigationLinks.map(link => ({
    ...link,
    isActive: link.id === 'stocks',
  })),

  withActivePortfolio: mockNavigationLinks.map(link => ({
    ...link,
    isActive: link.id === 'portfolio',
  })),

  withNoActive: mockNavigationLinks.map(link => ({
    ...link,
    isActive: false,
  })),
};
