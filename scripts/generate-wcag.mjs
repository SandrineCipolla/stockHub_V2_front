// scripts/generate-wcag.mjs
import {execSync} from "child_process";
import {writeFileSync} from "fs";

try {
    console.log("🎨 Lancement de l’audit WCAG...");
    const output = execSync("node scripts/audit-wcag.mjs", { encoding: "utf-8" });

    const passed = output.includes("100% CONFORME");
    const json = {
        passed,
        rawOutput: output,
        timestamp: new Date().toISOString(),
    };

    const filename = `risk-levels-${Date.now()}.json`;
    writeFileSync(`./documentation/metrics/data/${filename}`, JSON.stringify(json, null, 2));
    console.log(`💾 Rapport JSON généré : ${filename}`);
} catch (err) {
    console.error("❌ Erreur WCAG :", err.message);
    process.exit(1);
}
