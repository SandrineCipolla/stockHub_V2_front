/**
 * Contenus de test pour les cartes
 */
export const cardContent: Record<string, string> = {
    simple: 'Simple card content',
    withTitle: 'Card with title',
    longContent: 'This is a very long content that should demonstrate how the card handles longer text and multiple lines of content.',
};

/**
 * Titres de cartes pour les tests
 */
export const cardTitles: Record<string, string> = {
    stock: 'Stock Details',
    item: 'Item Information',
    summary: 'Summary',
    alert: 'Alert',
};

/**
 * Cas d'usage métier StockHub pour les cartes
 */
export const stockHubCardUseCases: Record<string, { title: string; content: string; clickable: boolean }> = {
    stockCard: {
        title: cardTitles.stock,
        content: 'Stock alimentaire - 42 articles',
        clickable: true,
    },
    itemCard: {
        title: cardTitles.item,
        content: 'Pommes Golden - Quantité: 50',
        clickable: true,
    },
    summaryCard: {
        title: cardTitles.summary,
        content: 'Total des stocks: 156 articles',
        clickable: false,
    },
    alertCard: {
        title: cardTitles.alert,
        content: '3 articles en stock faible',
        clickable: false,
    },
};