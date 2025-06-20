// update-scores.cjs
// Script pour mettre à jour le rapport avec tes scores réels

const fs = require('fs');

class ReportUpdater {
    constructor() {
        this.reportPath = './audits/AUDIT-REPORT.md';
        this.scores = {
            // 📊 À REMPLIR avec tes scores réels
            performance: 99,        // Score PageSpeed Performance (0-100)
            accessibility: 96,      // Score PageSpeed Accessibilité (0-100)
            seo: 100,               // Score PageSpeed SEO (0-100)
            bestPractices: 100,     // Score PageSpeed Best Practices (0-100)
            ecoGrade: "A",          // Grade EcoIndex (A-G)
            ecoScore: 88,          // Score EcoIndex (0-100)
            waveErrors: 0,        // Nombre erreurs WAVE
            waveAlerts: 0,        // Nombre alertes WAVE
            waveFunctions: null      // Nombre fonctionnalités WAVE
        };
    }

    // Méthode principale
    static async run() {
        const updater = new ReportUpdater();

        console.log('🔍 Vérification des fichiers...\n');
        updater.checkImages();

        console.log('\n📊 Saisie des scores...');
        await updater.promptScores();

        console.log('\n📝 Mise à jour du rapport...');
        await updater.updateReport();

        console.log('\n🎉 Terminé ! Ton rapport est prêt :');
        console.log('📄 Fichier : ./audits/AUDIT-REPORT.md');
        console.log('🌐 Ouvrir avec : code ./audits/AUDIT-REPORT.md');

        return updater.scores;
    }

    // Prompt interactif pour saisir les scores
    async promptScores() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (text) => new Promise(resolve => readline.question(text, resolve));

        console.log('🚀 Mise à jour du rapport avec tes scores réels\n');
        console.log('📊 SCORES LIGHTHOUSE (PageSpeed Insights) :');

        this.scores.performance = await question('Performance (0-100) : ');
        this.scores.accessibility = await question('Accessibilité (0-100) : ');
        this.scores.seo = await question('SEO (0-100) : ');
        this.scores.bestPractices = await question('Best Practices (0-100) : ');

        console.log('\n🌱 SCORE ECOINDEX :');
        this.scores.ecoGrade = await question('Grade EcoIndex (A-G) : ');
        this.scores.ecoScore = await question('Score EcoIndex (0-100) : ');

        console.log('\n♿ RÉSULTATS WAVE :');
        this.scores.waveErrors = await question('Nombre d\'erreurs WAVE : ');
        this.scores.waveAlerts = await question('Nombre d\'alertes WAVE : ');
        this.scores.waveFunctions = await question('Nombre de fonctionnalités WAVE : ');

        readline.close();
        return this.scores;
    }

    // Générer badge de statut coloré
    getStatusBadge(score, type = 'lighthouse') {
        const numScore = parseInt(score);

        if (type === 'ecoindex') {
            const gradeOrder = { 'A': 100, 'B': 85, 'C': 70, 'D': 55, 'E': 40, 'F': 25, 'G': 0 };
            const gradeScore = gradeOrder[score.toUpperCase()] || 0;

            if (gradeScore >= 85) return '![Status](https://img.shields.io/badge/Status-Excellent-brightgreen)';
            if (gradeScore >= 70) return '![Status](https://img.shields.io/badge/Status-Bon-green)';
            return '![Status](https://img.shields.io/badge/Status-À%20Améliorer-orange)';
        }

        if (numScore >= 90) return '![Status](https://img.shields.io/badge/Status-Excellent-brightgreen)';
        if (numScore >= 70) return '![Status](https://img.shields.io/badge/Status-Bon-green)';
        if (numScore >= 50) return '![Status](https://img.shields.io/badge/Status-Moyen-yellow)';
        return '![Status](https://img.shields.io/badge/Status-À%20Améliorer-orange)';
    }

    // Mettre à jour le tableau des scores
    updateScoresTable() {
        const table = `| Critère | Score | Statut | Objectif |
|---------|-------|--------|----------|
| **Performance** | \`${this.scores.performance}/100\` | ${this.getStatusBadge(this.scores.performance)} | > 90 |
| **Accessibilité** | \`${this.scores.accessibility}/100\` | ${this.getStatusBadge(this.scores.accessibility)} | > 95 |
| **SEO** | \`${this.scores.seo}/100\` | ${this.getStatusBadge(this.scores.seo)} | > 90 |
| **Best Practices** | \`${this.scores.bestPractices}/100\` | ${this.getStatusBadge(this.scores.bestPractices)} | > 90 |
| **Éco-conception** | \`Grade ${this.scores.ecoGrade}\` | ${this.getStatusBadge(this.scores.ecoGrade, 'ecoindex')} | > Grade C |`;

        return table;
    }

    // Mettre à jour la section WAVE
    updateWaveSection() {
        const waveTable = `| Indicateur | Nombre | Statut |
|------------|--------|--------|
| **Erreurs** | \`${this.scores.waveErrors}\` | ${this.scores.waveErrors == 0 ? '✅ Parfait' : '⚠️ À corriger'} |
| **Alertes** | \`${this.scores.waveAlerts}\` | ${this.scores.waveAlerts <= 5 ? '✅ Bon' : '⚠️ À vérifier'} |
| **Fonctionnalités** | \`${this.scores.waveFunctions}\` | ✅ Bon |`;

        return waveTable;
    }

    // Générer analyse des résultats
    generateAnalysis() {
        const avgScore = Math.round((
            parseInt(this.scores.performance) +
            parseInt(this.scores.accessibility) +
            parseInt(this.scores.seo) +
            parseInt(this.scores.bestPractices)
        ) / 4);

        let analysis = '\n## 📈 Analyse des Résultats\n\n';

        if (avgScore >= 85) {
            analysis += '🏆 **Excellent !** Ton application respecte tous les standards modernes.\n\n';
        } else if (avgScore >= 70) {
            analysis += '✅ **Très bon !** Quelques optimisations mineures possibles.\n\n';
        } else {
            analysis += '⚠️ **Bon départ !** Quelques améliorations à apporter.\n\n';
        }

        // Points forts
        analysis += '### 🚀 Points Forts\n';
        if (this.scores.performance >= 80) analysis += '- ✅ **Performance excellente** - Chargement rapide\n';
        if (this.scores.accessibility >= 90) analysis += '- ✅ **Accessibilité exemplaire** - Application inclusive\n';
        if (this.scores.seo >= 80) analysis += '- ✅ **SEO optimisé** - Bien référençable\n';
        if (this.scores.waveErrors == 0) analysis += '- ✅ **Accessibilité WAVE parfaite** - Aucune erreur\n';
        if (['A', 'B', 'C'].includes(this.scores.ecoGrade)) analysis += '- ✅ **Éco-conception responsable** - Impact réduit\n';

        // Améliorations
        analysis += '\n### 🔧 Améliorations Prioritaires\n';
        if (this.scores.performance < 70) analysis += '- 🔧 **Performance** - Optimiser images et bundles\n';
        if (this.scores.accessibility < 85) analysis += '- 🔧 **Accessibilité** - Vérifier contrastes et ARIA\n';
        if (this.scores.seo < 70) analysis += '- 🔧 **SEO** - Ajouter meta tags et Open Graph\n';
        if (this.scores.waveErrors > 0) analysis += '- 🔧 **WAVE** - Corriger les erreurs d\'accessibilité\n';
        if (['E', 'F', 'G'].includes(this.scores.ecoGrade)) analysis += '- 🔧 **Éco-conception** - Réduire poids et requêtes\n';

        analysis += '\n';
        return analysis;
    }

    // Mettre à jour le fichier rapport complet
    async updateReport() {
        if (!fs.existsSync(this.reportPath)) {
            console.log('❌ Fichier rapport non trouvé. Lance d\'abord generate-audit-report.cjs');
            return;
        }

        let content = fs.readFileSync(this.reportPath, 'utf8');

        // Remplacer le tableau des scores
        const scoresTableRegex = /\| Critère \| Score \| Statut \| Objectif \|[\s\S]*?\| \*\*Éco-conception\*\* \| `[^`]*` \| [^|]* \| > Grade C \|/;
        content = content.replace(scoresTableRegex, this.updateScoresTable());

        // Remplacer la section WAVE
        const waveTableRegex = /\| Indicateur \| Nombre \| Statut \|[\s\S]*?\| \*\*Fonctionnalités\*\* \| `[^`]*` \| [^|]* \|/;
        content = content.replace(waveTableRegex, this.updateWaveSection());

        // Ajouter l'analyse après la conclusion
        if (!content.includes('## 📈 Analyse des Résultats')) {
            const conclusionIndex = content.indexOf('## 📝 Conclusion');
            if (conclusionIndex !== -1) {
                content = content.slice(0, conclusionIndex) +
                    this.generateAnalysis() +
                    content.slice(conclusionIndex);
            }
        }

        // Mettre à jour la date
        content = content.replace(/Date d'audit.*:\s*\[DATE\]/,
            `Date d'audit** : ${new Date().toLocaleDateString('fr-FR')}`);

        fs.writeFileSync(this.reportPath, content, 'utf8');
        console.log('✅ Rapport mis à jour avec succès !');
    }

    // Vérifier que les images existent
    checkImages() {
        const images = [
            './audits/screenshots/lighthouse-scores.png',
            './audits/screenshots/wave-results.png',
            './audits/screenshots/ecoindex-results.png',
            './audits/responsive/mobile-iphone12.png',
            './audits/responsive/tablet-ipad.png',
            './audits/responsive/desktop-1920.png'
        ];

        console.log('\n📸 Vérification des images :');
        images.forEach(img => {
            const exists = fs.existsSync(img);
            console.log(`${exists ? '✅' : '❌'} ${img}`);
        });
    }
}

// Lancer si script exécuté directement
if (require.main === module) {
    ReportUpdater.run().catch(console.error);
}

module.exports = ReportUpdater;