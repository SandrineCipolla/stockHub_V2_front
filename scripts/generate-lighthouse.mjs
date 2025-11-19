/**
 * 🔦 Génération d’un rapport Lighthouse optimisé pour le dashboard StockHub V2
 * Mix RNCP : Scores clés + métriques + audits critiques + recommandations
 */

import {exec} from "child_process";
import {readFileSync, writeFileSync} from "fs";
import {promisify} from "util";

const execAsync = promisify(exec);

const TEST_URL = "http://localhost:4173"; // doit être servi avant l’audit

async function runLighthouse() {
    console.log("🚀 Audit Lighthouse en cours…");

    const timestamp = Date.now();
    const rawJsonPath = `./documentation/metrics/data/lighthouse-raw-${timestamp}.json`;
    const finalJsonPath = `./documentation/metrics/data/lighthouse-${timestamp}.json`;

    try {
        // Exécution Lighthouse
        const cmd = `npx lighthouse ${TEST_URL} \
      --output=json \
      --output-path=${rawJsonPath} \
      --only-categories=performance,accessibility,best-practices,seo \
      --quiet \
      --chrome-flags="--headless --no-sandbox"`;

        await execAsync(cmd);
        console.log(`💾 Rapport brut enregistré : ${rawJsonPath}`);

        // Lecture du rapport JSON brut
        const raw = JSON.parse(readFileSync(rawJsonPath, 'utf-8'));
        const categories = raw.categories;

        // Extraction des métriques importantes
        const fcp = raw.audits["first-contentful-paint"]?.displayValue;
        const lcp = raw.audits["largest-contentful-paint"]?.displayValue;
        const tbt = raw.audits["total-blocking-time"]?.displayValue;
        const cls = raw.audits["cumulative-layout-shift"]?.displayValue;

        // Audits critiques (fails)
        const failingAudits = Object.entries(raw.audits)
            .filter(([_, audit]) => audit.score !== null && audit.score < 0.9)
            .map(([id, audit]) => ({
                id,
                title: audit.title,
                score: audit.score,
                description: audit.description || null
            }))
            .slice(0, 10); // top 10

        // Recommandations basées sur les métriques
        const recommendations = [];
        const push = (msg) => recommendations.push({ message: msg });

        if (parseFloat(fcp) > 1.5) push("Améliorer la vitesse du First Contentful Paint");
        if (parseFloat(lcp) > 2.5) push("Optimiser le Largest Contentful Paint");
        if (parseFloat(tbt) > 100) push("Réduire le Total Blocking Time");
        if (parseFloat(cls) > 0.1) push("Corriger les décalages de layout (CLS)");

        // JSON final optimisé pour dashboard
        const final = {
            scores: {
                performance: categories.performance.score * 100,
                accessibility: categories.accessibility.score * 100,
                bestPractices: categories["best-practices"].score * 100,
                seo: categories.seo.score * 100
            },
            metrics: {
                fcp,
                lcp,
                tbt,
                cls
            },
            failingAudits,
            recommendations,
            info: {
                url: raw.requestedUrl,
                userAgent: raw.userAgent,
                lighthouseVersion: raw.lighthouseVersion,
                generatedAt: new Date().toISOString()
            }
        };

        // Sauvegarde
        writeFileSync(finalJsonPath, JSON.stringify(final, null, 2));
        console.log(`✨ Rapport optimisé : ${finalJsonPath}`);

    } catch (err) {
        console.error("❌ Erreur Lighthouse :", err);
        process.exit(1);
    }
}

runLighthouse();
