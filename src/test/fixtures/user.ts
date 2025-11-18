export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'analyst';
  preferences: {
    theme: 'light' | 'dark';
    language: 'fr' | 'en';
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  stats: {
    totalInvestment: number;
    totalGain: number;
    portfolioValue: number;
    stocksCount: number;
  };
  createdAt: string;
  lastLoginAt: string;
}

// Utilisateur par défaut (Sandrine Cipolla)
export const mockDefaultUser: User = {
  id: 'user-001',
  firstName: 'Sandrine',
  lastName: 'Cipolla',
  email: 'sandrine.cipolla@example.com',
  avatar: '/avatars/sandrine.jpg',
  role: 'admin',
  preferences: {
    theme: 'dark',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
  },
  stats: {
    totalInvestment: 50000,
    totalGain: 7500,
    portfolioValue: 57500,
    stocksCount: 12,
  },
  createdAt: '2024-01-15T10:00:00Z',
  lastLoginAt: '2024-10-08T08:30:00Z',
};

// Autres utilisateurs pour les tests
export const mockUsers: User[] = [
  mockDefaultUser,
  {
    id: 'user-002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'user',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: false,
        push: true,
        inApp: true,
      },
    },
    stats: {
      totalInvestment: 25000,
      totalGain: 2500,
      portfolioValue: 27500,
      stocksCount: 8,
    },
    createdAt: '2024-03-20T14:30:00Z',
    lastLoginAt: '2024-10-07T16:45:00Z',
  },
  {
    id: 'user-003',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    role: 'analyst',
    preferences: {
      theme: 'light',
      language: 'fr',
      notifications: {
        email: true,
        push: false,
        inApp: true,
      },
    },
    stats: {
      totalInvestment: 100000,
      totalGain: -5000,
      portfolioValue: 95000,
      stocksCount: 25,
    },
    createdAt: '2024-02-10T09:15:00Z',
    lastLoginAt: '2024-10-08T07:20:00Z',
  },
];

// Données utilisateur pour différents scénarios de test
export const mockUserScenarios = {
  // Nouvel utilisateur sans portefeuille
  newUser: {
    ...mockDefaultUser,
    id: 'user-new',
    firstName: 'Nouveau',
    lastName: 'Utilisateur',
    stats: {
      totalInvestment: 0,
      totalGain: 0,
      portfolioValue: 0,
      stocksCount: 0,
    },
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },

  // Utilisateur avec gros portefeuille
  wealthyUser: {
    ...mockDefaultUser,
    id: 'user-wealthy',
    firstName: 'Richard',
    lastName: 'Wealthy',
    stats: {
      totalInvestment: 1000000,
      totalGain: 250000,
      portfolioValue: 1250000,
      stocksCount: 50,
    },
  },

  // Utilisateur avec pertes
  losingUser: {
    ...mockDefaultUser,
    id: 'user-losing',
    firstName: 'Paul',
    lastName: 'Loser',
    stats: {
      totalInvestment: 30000,
      totalGain: -8000,
      portfolioValue: 22000,
      stocksCount: 15,
    },
  },
};

// Helpers pour les tests
export const getUserDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getUserInitials = (user: User): string => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

export const isUserProfitable = (user: User): boolean => {
  return user.stats.totalGain > 0;
};
