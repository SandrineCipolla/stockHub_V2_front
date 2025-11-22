#!/usr/bin/env node

/**
 * Serveur HTTP simple pour tester le dashboard des métriques en local
 * Résout les problèmes CORS avec le protocole file://
 *
 * Utilisation: node scripts/serve-metrics.mjs
 * Puis ouvrir: http://localhost:8080
 */

import { createServer } from 'http';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const METRICS_DIR = join(__dirname, '..', 'documentation', 'metrics');
const PORT = 8080;

// Types MIME
const MIME_TYPES = {
    '.html': 'text/html',
    '.json': 'application/json',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const ext = extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function generateDirectoryListing(dirPath, urlPath) {
    const files = readdirSync(dirPath);

    const items = files.map(file => {
        const fullPath = join(dirPath, file);
        const stats = statSync(fullPath);
        const isDir = stats.isDirectory();
        const href = urlPath === '/' ? `/${file}` : `${urlPath}/${file}`;

        return `<li><a href="${href}">${file}${isDir ? '/' : ''}</a></li>`;
    }).join('\n');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Index of ${urlPath}</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff; }
        h1 { color: #8b5cf6; }
        a { color: #a78bfa; text-decoration: none; }
        a:hover { text-decoration: underline; }
        li { padding: 5px 0; }
    </style>
</head>
<body>
    <h1>Index of ${urlPath}</h1>
    <ul>
        ${urlPath !== '/' ? '<li><a href="..">../</a></li>' : ''}
        ${items}
    </ul>
</body>
</html>`;
}

const server = createServer((req, res) => {
    // Décoder l'URL et nettoyer
    let urlPath = decodeURIComponent(req.url.split('?')[0]);

    // Rediriger / vers /index.html
    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    const filePath = join(METRICS_DIR, urlPath);

    // Sécurité : empêcher l'accès en dehors du dossier metrics
    if (!filePath.startsWith(METRICS_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    try {
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            // Si c'est un dossier, essayer d'afficher index.html ou générer un listing
            const indexPath = join(filePath, 'index.html');
            try {
                const content = readFileSync(indexPath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            } catch {
                // Générer un listing du dossier
                const listing = generateDirectoryListing(filePath, urlPath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(listing);
            }
        } else {
            // Servir le fichier
            const content = readFileSync(filePath);
            const mimeType = getMimeType(filePath);

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }

        console.log(`✅ ${req.method} ${urlPath} - 200`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            console.log(`❌ ${req.method} ${urlPath} - 404`);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            console.error(`❌ ${req.method} ${urlPath} - 500:`, error.message);
        }
    }
});

server.listen(PORT, () => {
    console.log('\n🚀 Serveur de métriques démarré!\n');
    console.log(`   📊 Dashboard: http://localhost:${PORT}`);
    console.log(`   📁 Dossier: ${METRICS_DIR}\n`);
    console.log('   Appuyez sur Ctrl+C pour arrêter\n');
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n\n👋 Arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement\n');
        process.exit(0);
    });
});
