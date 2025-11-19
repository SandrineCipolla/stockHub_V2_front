/**
 * 📈 Génération JSON Coverage – StockHub V2
 * Transforme le rapport Vitest/Istanbul en JSON exploitable par le dashboard
 */

import {execSync} from "child_process";
import {existsSync, readFileSync, writeFileSync} from "fs";

async function generateCoverageJSON() {
    console.log("📊 Génération du JSON coverage…");

    const timestamp = Date.now();
    const coverageDir = "./coverage";
    const coverageJsonPath = `${coverageDir}/coverage-final.json`;
    const outputPath = `./documentation/metrics/data/coverage-${timestamp}.json`;

    try {
        // 1️⃣ Lancer Vitest coverage
        console.log("⏳ Exécution des tests coverage (Vitest)...");
        execSync("npm run test:coverage -- --reporter=json", { stdio: "pipe" });

        if (!existsSync(coverageJsonPath)) {
            console.error("❌ coverage-final.json introuvable !");
            process.exit(1);
        }

        // 2️⃣ Charger coverage-final.json (Istanbul format)
        const data = JSON.parse(readFileSync(coverageJsonPath, "utf-8"));

        const files = Object.keys(data);

        // 3️⃣ Calcul global
        let totalLines = 0,
            coveredLines = 0,
            totalBranches = 0,
            coveredBranches = 0,
            totalFuncs = 0,
            coveredFuncs = 0;

        const fileBreakdown = files.map((file) => {
            const f = data[file];

            totalLines += f.lines.total;
            coveredLines += f.lines.covered;
            totalBranches += f.branches.total;
            coveredBranches += f.branches.covered;
            totalFuncs += f.functions.total;
            coveredFuncs += f.functions.covered;

            return {
                file,
                lines: (f.lines.covered / f.lines.total * 100).toFixed(2),
                branches: (f.branches.covered / f.branches.total * 100).toFixed(2),
                functions: (f.functions.covered / f.functions.total * 100).toFixed(2)
            };
        });

        const globalCoverage = {
            lines: (coveredLines / totalLines * 100).toFixed(2),
            branches: (coveredBranches / totalBranches * 100).toFixed(2),
            functions: (coveredFuncs / totalFuncs * 100).toFixed(2)
        };

        // 4️⃣ Résultat final
        const result = {
            global: globalCoverage,
            files: fileBreakdown,
            totalFiles: files.length,
            timestamp: new Date().toISOString()
        };

        // 5️⃣ Sauvegarde
        writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`💾 Report coverage généré : ${outputPath}`);

    } catch (err) {
        console.error("❌ Erreur lors du coverage :", err.message);
        process.exit(1);
    }
}

generateCoverageJSON();
