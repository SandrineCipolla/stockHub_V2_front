/**
 * ♿ Génération JSON Accessibilité – prefers-reduced-motion
 * Produit un JSON utilisable par le dashboard dynamique StockHub V2
 */

import {execSync} from "child_process";
import {writeFileSync} from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(
    __dirname,
    "..",
    "documentation",
    "metrics",
    "data"
);

async function main() {
    console.log("♿ Génération du JSON d’accessibilité…");

    try {
        // Lancer l’audit via ton script existant
        console.log("⏳ Exécution du test reduced motion…");
        const output = execSync("node scripts/audit-a11y.mjs", {
            encoding: "utf-8",
            stdio: "pipe",
        });

        let passed = false;

        if (output.includes("TOUS LES TESTS PASSENT")) {
            passed = true;
        } else if (output.includes("partiellement")) {
            passed = false;
        }

        const json = {
            passed,
            rawOutput: output,
            status: passed
                ? "Totalement conforme"
                : "Partiellement ou non conforme",
            timestamp: new Date().toISOString(),
        };

        const filename = `a11y-${Date.now()}.json`;
        const filepath = path.join(OUTPUT_DIR, filename);

        writeFileSync(filepath, JSON.stringify(json, null, 2));

        console.log(`💾 Rapport JSON généré : ${filepath}`);
    } catch (err) {
        console.error("❌ Erreur lors du test A11Y :", err.message);

        // Générer un JSON d'erreur pour éviter un dashboard vide
        const errorJson = {
            passed: false,
            error: err.message,
            timestamp: new Date().toISOString(),
        };

        const filename = `a11y-${Date.now()}.json`;
        const filepath = path.join(OUTPUT_DIR, filename);
        writeFileSync(filepath, JSON.stringify(errorJson, null, 2));

        console.log(`⚠️ Rapport JSON d’erreur sauvegardé : ${filepath}`);
        process.exit(1);
    }
}

main();
