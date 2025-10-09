import type {InputType} from '@/types';

/**
 * Labels d'input pour les tests
 */
export const inputLabels: Record<string, string> = {
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    quantity: 'Quantité',
    search: 'Rechercher',
    price: 'Prix',
};

/**
 * Messages d'erreur pour les tests d'input
 */
export const inputErrors: Record<string, string> = {
    required: 'Ce champ est requis',
    invalidEmail: 'Email invalide',
    tooShort: 'Le texte est trop court',
    tooLong: 'Le texte est trop long',
    invalidNumber: 'Veuillez entrer un nombre valide',
    negativeNumber: 'Le nombre ne peut pas être négatif',
};

/**
 * Textes d'aide pour les tests d'input
 */
export const inputHelperTexts: Record<string, string> = {
    email: 'Entrez votre adresse email',
    password: 'Minimum 8 caractères',
    quantity: 'Entrez la quantité en stock',
    search: 'Rechercher un article',
};

/**
 * Placeholders pour les tests d'input
 */
export const inputPlaceholders: Record<string, string> = {
    email: 'exemple@email.com',
    password: '••••••••',
    name: 'Votre nom',
    quantity: '0',
    search: 'Rechercher...',
};

/**
 * Valeurs de test pour les inputs
 */
export const inputTestValues: Record<string, string | number> = {
    validEmail: 'test@example.com',
    invalidEmail: 'not-an-email',
    validPassword: 'SecurePass123',
    shortPassword: '123',
    validName: 'John Doe',
    validQuantity: 42,
    negativeQuantity: -5,
    searchQuery: 'pommes',
};

/**
 * Cas d'usage métier StockHub pour les inputs
 */
export const stockHubInputUseCases: Record<string, {
    type: InputType;
    label: string;
    placeholder: string;
    helperText?: string;
}> = {
    stockName: {
        type: 'text',
        label: 'Nom du stock',
        placeholder: 'Ex: Stock Alimentaire',
        helperText: 'Donnez un nom descriptif à votre stock',
    },
    itemQuantity: {
        type: 'number',
        label: inputLabels.quantity,
        placeholder: '0',
        helperText: inputHelperTexts.quantity,
    },
    itemSearch: {
        type: 'search',
        label: inputLabels.search,
        placeholder: inputPlaceholders.search,
        helperText: inputHelperTexts.search,
    },
    itemPrice: {
        type: 'number',
        label: inputLabels.price,
        placeholder: '0.00',
        helperText: 'Prix unitaire en euros',
    },
};