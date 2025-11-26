const fs = require('fs');
const path = require('path');

// Read the raw Lighthouse data
const rawDataPath = path.join(__dirname, 'data', 'lighthouse-raw-1763634146672.json');
const data = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// Extract failed audits by category
const categories = {
  performance: [],
  accessibility: [],
  'best-practices': [],
  seo: []
};

// Map audit IDs to categories based on Lighthouse structure
Object.entries(data.audits).forEach(([id, audit]) => {
  if (audit.score !== null && audit.score < 1) {
    const failedAudit = {
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      displayValue: audit.displayValue
    };

    // Categorize based on audit ID patterns
    if (id.includes('contrast') || id.includes('aria') || id.includes('label') ||
        id.includes('heading') || id.includes('button') || id.includes('link') ||
        id.includes('tabindex') || id.includes('lang') || id.includes('meta')) {
      categories.accessibility.push(failedAudit);
    } else if (id.includes('https') || id.includes('console') || id.includes('image') ||
               id.includes('doctype') || id.includes('charset') || id.includes('vulnerable')) {
      categories['best-practices'].push(failedAudit);
    } else if (id.includes('meta-description') || id.includes('robots') ||
               id.includes('canonical') || id.includes('hreflang') || id.includes('title')) {
      categories.seo.push(failedAudit);
    } else if (id.includes('paint') || id.includes('speed') || id.includes('render') ||
               id.includes('layout') || id.includes('cls') || id.includes('lcp') ||
               id.includes('fcp') || id.includes('tti') || id.includes('tbt')) {
      categories.performance.push(failedAudit);
    }
  }
});

console.log('Failed Audits by Category:\n');
console.log('PERFORMANCE:', categories.performance.length);
categories.performance.forEach(audit => {
  console.log(`  - [${audit.score}] ${audit.title}`);
});

console.log('\nACCESSIBILITY:', categories.accessibility.length);
categories.accessibility.forEach(audit => {
  console.log(`  - [${audit.score}] ${audit.title}`);
});

console.log('\nSEO:', categories.seo.length);
categories.seo.forEach(audit => {
  console.log(`  - [${audit.score}] ${audit.title}`);
});

console.log('\nBEST PRACTICES:', categories['best-practices'].length);
categories['best-practices'].forEach(audit => {
  console.log(`  - [${audit.score}] ${audit.title}`);
});

// Export for use in HTML
console.log('\n\n=== JSON OUTPUT ===');
console.log(JSON.stringify(categories, null, 2));
