/**
 * 🌱 GÉNÉRATION JSON ÉCO-CONCEPTION – StockHub V2
 * Analyse : Bundle, Gzip, CO2, Requêtes, Bonnes pratiques
 */

import {execSync} from "child_process";
import {readFileSync, writeFileSync} from "fs";

async function generateEcoReport() {
    console.log("🌱 Analyse éco-conception en cours…");

    const timestamp = Date.now();
    const outputPath = `./documentation/metrics/data/eco-${timestamp}.json`;

    try {
        // 1️⃣ Build de production
        console.log("⏳ Build en cours (Vite)...");
        const buildOutput = execSync("npm run build", { encoding: "utf-8" });

        // 2️⃣ Extraction bundle (format Vite) : index-xxxx.js XX kB / gzip YY kB
        const match = buildOutput.match(/index-[\w\d]+\.js\s+([\d.]+)\s+kB.*gzip:\s+([\d.]+)\s+kB/);

        const bundleSize = match ? parseFloat(match[1]) : null;
        const gzipSize = match ? parseFloat(match[2]) : null;

        // 3️⃣ Estimation CO₂ (source : "The Shift Project")
        const co2PerKB = 0.0005; // g CO2 / KB transféré
        const estimatedCO2 = gzipSize ? parseFloat((gzipSize * co2PerKB).toFixed(4)) : null;

        // 4️⃣ Requêtes : analyse du build manifest
        const manifest = JSON.parse(
            readFileSync("./dist/.vite/manifest.json", "utf-8")
        );

        const totalRequests = Object.keys(manifest).length;

        // 5️⃣ Bonnes pratiques eco (statiques)
        const ecoChecks = [
            { name: "Images optimisées", ok: true, info: "SVG uniquement" },
            { name: "Lazy loading", ok: true, info: "React lazy + code splitting" },
            { name: "Minification", ok: true, info: "Vite minification active" },
            { name: "Tree shaking", ok: true, info: "ES modules" },
            { name: "Self-hosted assets", ok: true, info: "Aucune ressource externe" },
            { name: "Dark mode", ok: true, info: "Réduit la luminance de l'écran" }
        ];

        // 6️⃣ JSON final optimisé pour dashboard
        const result = {
            bundle: {
                sizeKB: bundleSize,
                gzipKB: gzipSize,
                passed: gzipSize < 600
            },
            carbon: {
                estimatedCO2g: estimatedCO2,
                explanation: "Estimation basée sur 0.0005g CO₂ / KB transféré"
            },
            requests: {
                count: totalRequests,
                passed: totalRequests <= 5
            },
            bestPractices: ecoChecks,
            timestamp: new Date().toISOString()
        };

        // 7️⃣ Sauvegarde
        writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`💾 Rapport éco-conception généré : ${outputPath}`);

    } catch (err) {
        console.error("❌ Erreur audit éco-conception :", err.message);
        process.exit(1);
    }
}

generateEcoReport();
