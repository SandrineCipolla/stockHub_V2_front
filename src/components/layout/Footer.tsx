import React from 'react';
import {useTheme} from '@/hooks/useTheme.ts';
import type {FooterLink, FooterProps} from '@/types';

const defaultLinks: FooterLink[] = [
    { label: 'Mentions Légales', href: '#' },
    { label: 'Politique de Confidentialité', href: '#' },
    { label: 'CGU', href: '#' },
    { label: 'Politique de Cookies', href: '#' }
];

export const Footer: React.FC<FooterProps> = ({
                                                  className = '',
                                                  companyName = 'STOCK HUB',
                                                  year = new Date().getFullYear(),
                                                  links = defaultLinks
                                              }) => {
    const { theme } = useTheme();

    const themeClasses = {
        footer: theme === 'dark'
            ? 'border-white/10 bg-slate-900/50'
            : 'border-gray-200 bg-gray-50/80',
        textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    return (
        <footer
            className={`mt-16 border-t py-8 ${themeClasses.footer} ${className}`}
            role="contentinfo"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center">
                    <p className={`text-sm mb-4 ${themeClasses.textSubtle}`}>
                        {companyName} - ALL RIGHTS RESERVED © {year}
                    </p>

                    <nav
                        className="flex flex-wrap justify-center gap-6 text-sm"
                        aria-label="Liens légaux"
                    >
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
                                target={link.external ? '_blank' : undefined}
                                rel={link.external ? 'noopener noreferrer' : undefined}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};