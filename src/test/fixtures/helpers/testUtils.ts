import {fireEvent} from '@testing-library/react';

/**
 * événement clavier Enter ou Space
 */
export function pressEnterOrSpace(element: HTMLElement, key: 'Enter' | ' ') {
    fireEvent.keyDown(element, {
        key,
        code: key === 'Enter' ? 'Enter' : 'Space',
        charCode: key.charCodeAt(0)
    });
}

/**
 * Attend un certain délai (pour les animations)
 */
export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getClassSet(element: HTMLElement): Set<string> {
    return new Set(element.className.split(' ').filter(Boolean));
}