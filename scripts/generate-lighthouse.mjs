/**
 * 🔦 Génération d'un rapport Lighthouse optimisé pour le dashboard StockHub V2
 * Mix RNCP : Scores clés + métriques + audits critiques + recommandations
 *
 * Version 2.0 : Multi-run avec calcul de médiane pour scores stables
 */

import {exec} from "child_process";
import {readFileSync, writeFileSync, unlinkSync} from "fs";
import {promisify} from "util";

const execAsync = promisify(exec);

// Configuration
const TEST_URL = process.argv[2] || "http://localhost:4173"; // URL configurable via CLI
const NUM_RUNS = 3; // Nombre de runs pour stabilité
const PAUSE_BETWEEN_RUNS = parseInt(process.env.LIGHTHOUSE_PAUSE_MS || '2000', 10); // Délai entre runs (ms)

/**
 * Calcule la médiane d'un tableau de nombres
 */
function median(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

/**
 * Exécute un seul run Lighthouse
 */
async function singleRun(runNumber) {
    const timestamp = Date.now();
    const rawJsonPath = `./docs/metrics/data/lighthouse-raw-${timestamp}-run${runNumber}.json`;

    try {
        const cmd = `npx lighthouse ${TEST_URL} \
      --output=json \
      --output-path=${rawJsonPath} \
      --only-categories=performance,accessibility,best-practices,seo \
      --quiet \
      --chrome-flags="--headless --no-sandbox"`;

        await execAsync(cmd);

        const raw = JSON.parse(readFileSync(rawJsonPath, 'utf-8'));

        // Nettoyer le fichier temporaire
        unlinkSync(rawJsonPath);

        return {
            scores: {
                performance: Math.round(raw.categories.performance.score * 100),
                accessibility: Math.round(raw.categories.accessibility.score * 100),
                bestPractices: Math.round(raw.categories["best-practices"].score * 100),
                seo: Math.round(raw.categories.seo.score * 100)
            },
            metrics: {
                fcp: raw.audits["first-contentful-paint"]?.displayValue,
                lcp: raw.audits["largest-contentful-paint"]?.displayValue,
                tbt: raw.audits["total-blocking-time"]?.displayValue,
                cls: raw.audits["cumulative-layout-shift"]?.displayValue
            },
            raw // Garder le raw complet pour le dernier run
        };
    } catch (err) {
        console.error(`❌ Erreur run ${runNumber}:`, err.message);
        throw err;
    }
}

/**
 * Exécute plusieurs runs Lighthouse et calcule les statistiques
 */
async function runLighthouseMulti() {
    console.log(`🚀 Audit Lighthouse Multi-Run (${NUM_RUNS} runs)`);
    console.log(`📍 URL: ${TEST_URL}\n`);

    const results = [];

    // Exécuter N runs
    for (let i = 1; i <= NUM_RUNS; i++) {
        console.log(`⏳ Run ${i}/${NUM_RUNS}...`);
        const result = await singleRun(i);
        results.push(result);

        console.log(`   Perf ${result.scores.performance} | A11y ${result.scores.accessibility} | BP ${result.scores.bestPractices} | SEO ${result.scores.seo}`);

        // Pause entre runs pour stabilité
        if (i < NUM_RUNS) {
            await new Promise(resolve => setTimeout(resolve, PAUSE_BETWEEN_RUNS));
        }
    }

    console.log("\n📊 Calcul des statistiques...\n");

    // Extraire les scores de chaque catégorie
    const perfScores = results.map(r => r.scores.performance);
    const a11yScores = results.map(r => r.scores.accessibility);
    const bpScores = results.map(r => r.scores.bestPractices);
    const seoScores = results.map(r => r.scores.seo);

    // Calculer médiane et range
    const stats = {
        performance: {
            median: Math.round(median(perfScores)),
            min: Math.min(...perfScores),
            max: Math.max(...perfScores),
            range: Math.max(...perfScores) - Math.min(...perfScores)
        },
        accessibility: {
            median: Math.round(median(a11yScores)),
            min: Math.min(...a11yScores),
            max: Math.max(...a11yScores),
            range: Math.max(...a11yScores) - Math.min(...a11yScores)
        },
        bestPractices: {
            median: Math.round(median(bpScores)),
            min: Math.min(...bpScores),
            max: Math.max(...bpScores),
            range: Math.max(...bpScores) - Math.min(...bpScores)
        },
        seo: {
            median: Math.round(median(seoScores)),
            min: Math.min(...seoScores),
            max: Math.max(...seoScores),
            range: Math.max(...seoScores) - Math.min(...seoScores)
        }
    };

    // Afficher résultats
    console.log("📈 Résultats finaux:\n");

    const formatStat = (name, stat) => {
        const icon = stat.median >= 90 ? '✅' : stat.median >= 70 ? '⚠️' : '❌';
        const rangeStr = stat.range > 0 ? ` (±${stat.range})` : ' (stable)';
        return `${icon} ${name.padEnd(16)}: ${stat.median}${rangeStr.padEnd(12)} [min: ${stat.min}, max: ${stat.max}]`;
    };

    console.log(formatStat('Performance', stats.performance));
    console.log(formatStat('Accessibility', stats.accessibility));
    console.log(formatStat('Best Practices', stats.bestPractices));
    console.log(formatStat('SEO', stats.seo));

    // Utiliser le dernier run pour les détails complets
    const lastRun = results[NUM_RUNS - 1];
    const raw = lastRun.raw;

    // Extraction des métriques importantes (pour affichage)
    const fcp = lastRun.metrics.fcp;
    const lcp = lastRun.metrics.lcp;
    const tbt = lastRun.metrics.tbt;
    const cls = lastRun.metrics.cls;

    // Extraction des valeurs numériques pour comparaisons fiables
    const fcpValue = raw.audits["first-contentful-paint"]?.numericValue / 1000; // ms → s
    const lcpValue = raw.audits["largest-contentful-paint"]?.numericValue / 1000; // ms → s
    const tbtValue = raw.audits["total-blocking-time"]?.numericValue; // déjà en ms
    const clsValue = raw.audits["cumulative-layout-shift"]?.numericValue; // sans unité

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

    // Recommandations basées sur les métriques (utilise valeurs numériques fiables)
    const recommendations = [];
    const push = (msg) => recommendations.push({ message: msg });

    if (fcpValue > 1.5) push("Améliorer la vitesse du First Contentful Paint");
    if (lcpValue > 2.5) push("Optimiser le Largest Contentful Paint");
    if (tbtValue > 100) push("Réduire le Total Blocking Time");
    if (clsValue > 0.1) push("Corriger les décalages de layout (CLS)");

    // JSON final optimisé pour dashboard (utilise les médianes)
    const timestamp = Date.now();
    const finalJsonPath = `./docs/metrics/data/lighthouse-${timestamp}.json`;

    const final = {
        scores: {
            performance: stats.performance.median,
            accessibility: stats.accessibility.median,
            bestPractices: stats.bestPractices.median,
            seo: stats.seo.median
        },
        scoresRange: {
            performance: `${stats.performance.min}-${stats.performance.max}`,
            accessibility: `${stats.accessibility.min}-${stats.accessibility.max}`,
            bestPractices: `${stats.bestPractices.min}-${stats.bestPractices.max}`,
            seo: `${stats.seo.min}-${stats.seo.max}`
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
            generatedAt: new Date().toISOString(),
            multiRun: {
                runs: NUM_RUNS,
                method: 'median'
            }
        }
    };

    // Sauvegarder le rapport brut complet du dernier run
    const rawJsonPath = `./docs/metrics/data/lighthouse-raw-${timestamp}.json`;
    writeFileSync(rawJsonPath, JSON.stringify(raw, null, 2));
    console.log(`\n💾 Rapport brut enregistré : ${rawJsonPath}`);

    // Sauvegarde du rapport final
    writeFileSync(finalJsonPath, JSON.stringify(final, null, 2));
    console.log(`✨ Rapport optimisé : ${finalJsonPath}\n`);
}

runLighthouseMulti().catch(err => {
    console.error("❌ Erreur fatale:", err);
    process.exit(1);
});
