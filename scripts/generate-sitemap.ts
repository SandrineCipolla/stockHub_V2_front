import fs from 'fs';
import path from 'path';

interface SitemapRoute {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const envBase = process.env.PUBLIC_BASE_URL || process.env.VITE_PUBLIC_BASE_URL;
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const ghPagesBase = repoName
  ? `https://${process.env.GITHUB_ACTOR || 'username'}.github.io/${repoName}`
  : undefined;
const baseUrl = envBase || ghPagesBase || 'https://stockhub-v2.vercel.app'; // Remplacez par votre vraie URL

const routes: SitemapRoute[] = [
  {
    loc: '/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    loc: '/dashboard',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: '/stocks',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    loc: '/analytics',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    loc: '/settings',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
  },
];

function generateSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    route => `  <url>
    <loc>${baseUrl}${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /_vercel/

Sitemap: ${baseUrl}/sitemap.xml`;
}

// Génération des fichiers
const sitemap = generateSitemap();
const robotsTxt = generateRobotsTxt();

// Écriture dans le dossier public
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

console.log('✅ Sitemap et robots.txt générés dans public/');
console.log('📍 Sitemap URL:', `${baseUrl}/sitemap.xml`);
console.log('🤖 Robots.txt URL:', `${baseUrl}/robots.txt`);
