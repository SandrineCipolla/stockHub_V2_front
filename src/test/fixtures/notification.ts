export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'stock' | 'portfolio' | 'system' | 'alert';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

// Notifications par défaut
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'warning',
    title: 'Action AAPL en baisse',
    message: "Apple Inc. a chuté de 3.2% aujourd'hui. Surveillez votre portefeuille.",
    timestamp: '2024-10-08T09:15:00Z',
    isRead: false,
    priority: 'medium',
    category: 'stock',
    actionUrl: '/stocks/AAPL',
    actionLabel: 'Voir le détail',
    metadata: {
      symbol: 'AAPL',
      change: -3.2,
      currentPrice: 175.43,
    },
  },
  {
    id: 'notif-002',
    type: 'success',
    title: "Ordre d'achat exécuté",
    message: "Votre ordre d'achat de 10 actions MSFT a été exécuté avec succès.",
    timestamp: '2024-10-08T08:30:00Z',
    isRead: false,
    priority: 'high',
    category: 'portfolio',
    actionUrl: '/portfolio',
    actionLabel: 'Voir le portefeuille',
    metadata: {
      symbol: 'MSFT',
      quantity: 10,
      price: 412.85,
    },
  },
  {
    id: 'notif-003',
    type: 'info',
    title: 'Rapport mensuel disponible',
    message: 'Votre rapport de performance mensuel est maintenant disponible.',
    timestamp: '2024-10-07T17:00:00Z',
    isRead: false,
    priority: 'low',
    category: 'system',
    actionUrl: '/reports/monthly',
    actionLabel: 'Télécharger',
  },
  {
    id: 'notif-004',
    type: 'error',
    title: 'Échec de connexion API',
    message: 'Impossible de récupérer les données en temps réel. Réessayez plus tard.',
    timestamp: '2024-10-07T15:45:00Z',
    isRead: true,
    priority: 'high',
    category: 'system',
  },
  {
    id: 'notif-005',
    type: 'warning',
    title: 'Limite de stop-loss atteinte',
    message: 'TSLA a atteint votre limite de stop-loss de 5%.',
    timestamp: '2024-10-07T14:20:00Z',
    isRead: true,
    priority: 'high',
    category: 'alert',
    actionUrl: '/stocks/TSLA',
    actionLabel: "Gérer l'alerte",
    metadata: {
      symbol: 'TSLA',
      stopLossPercent: 5,
      triggeredPrice: 238.77,
    },
  },
];

// Notifications pour différents scénarios
export const mockNotificationScenarios = {
  // Notifications non lues seulement
  unreadOnly: mockNotifications.filter(n => !n.isRead),

  // Notifications par type
  stockAlerts: mockNotifications.filter(n => n.category === 'stock' || n.category === 'alert'),
  portfolioUpdates: mockNotifications.filter(n => n.category === 'portfolio'),
  systemMessages: mockNotifications.filter(n => n.category === 'system'),

  // Notifications par priorité
  highPriority: mockNotifications.filter(n => n.priority === 'high'),

  // Nouvelles notifications (dernières 24h)
  recent: mockNotifications.filter(n => {
    const notifDate = new Date(n.timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return notifDate > yesterday;
  }),

  // Aucune notification
  empty: [] as Notification[],

  // Beaucoup de notifications
  many: [
    ...mockNotifications,
    ...Array.from(
      { length: 15 },
      (_, i): Notification => ({
        id: `notif-bulk-${i + 6}`,
        type: 'info',
        title: `Notification ${i + 6}`,
        message: `Message de notification automatique ${i + 6}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        isRead: i % 3 === 0,
        priority: 'low',
        category: 'system',
      })
    ),
  ],
};

// Statistiques des notifications
export const getNotificationStats = (notifications: Notification[]) => ({
  total: notifications.length,
  unread: notifications.filter(n => !n.isRead).length,
  byType: {
    info: notifications.filter(n => n.type === 'info').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    error: notifications.filter(n => n.type === 'error').length,
    success: notifications.filter(n => n.type === 'success').length,
  },
  byPriority: {
    low: notifications.filter(n => n.priority === 'low').length,
    medium: notifications.filter(n => n.priority === 'medium').length,
    high: notifications.filter(n => n.priority === 'high').length,
  },
});

// Helpers pour les tests
export const markAsRead = (
  notifications: Notification[],
  notificationId: string
): Notification[] => {
  return notifications.map(n => (n.id === notificationId ? { ...n, isRead: true } : n));
};

export const markAllAsRead = (notifications: Notification[]): Notification[] => {
  return notifications.map(n => ({ ...n, isRead: true }));
};

export const addNotification = (
  notifications: Notification[],
  newNotification: Omit<Notification, 'id' | 'timestamp'>
): Notification[] => {
  const notification: Notification = {
    ...newNotification,
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  return [notification, ...notifications];
};

export const deleteNotification = (
  notifications: Notification[],
  notificationId: string
): Notification[] => {
  return notifications.filter(n => n.id !== notificationId);
};
