/**
 * @fileoverview Exemples d'utilisation du système de gestion de containers
 * @description Montre comment gérer les achats et l'usage de tubes de peinture
 */

import type { Stock } from '@/types/stock';
import { purchaseContainers, recordUsage } from '@/utils/containerManager';

// ===== EXEMPLE 1 : Création d'un stock avec containers =====

const acryliqueBleu: Stock = {
  id: 1,
  name: "Acrylique Bleu Cobalt",
  quantity: 65,                  // 65% restants
  unit: 'percentage',
  containerCapacity: 100,        // 1 tube = 100ml
  containersOwned: 1,            // Je possède 1 tube
  value: 12,
  status: "optimal",
  lastUpdate: "3j",
  category: "Peinture",
  minThreshold: 20,
  maxThreshold: 100,
};

console.log("=== Stock initial ===");
console.log(`${acryliqueBleu.name}: ${acryliqueBleu.quantity}%`);
console.log(`Tubes possédés: ${acryliqueBleu.containersOwned}`);
// Sortie: "Acrylique Bleu Cobalt: 65%"
//         "Tubes possédés: 1"

// ===== EXEMPLE 2 : Achat de nouveaux tubes =====

console.log("\n=== Achat de 2 tubes supplémentaires ===");
const purchaseResult = purchaseContainers(acryliqueBleu, 2);

console.log(purchaseResult.message);
// Sortie: "2 tubes ajoutés. Nouveau total : 265% (3 tubes)"

// Mise à jour du stock
acryliqueBleu.quantity = purchaseResult.newQuantity;           // 265%
acryliqueBleu.containersOwned = purchaseResult.newContainersOwned; // 3 tubes
acryliqueBleu.totalCapacity = purchaseResult.totalCapacity;    // 300ml

console.log(`Nouvelle quantité: ${acryliqueBleu.quantity}%`);
console.log(`Tubes possédés: ${acryliqueBleu.containersOwned}`);
console.log(`Capacité totale: ${acryliqueBleu.totalCapacity}ml`);
// Sortie: "Nouvelle quantité: 265%"
//         "Tubes possédés: 3"
//         "Capacité totale: 300ml"

// ===== EXEMPLE 3 : Enregistrement d'une session de peinture =====

console.log("\n=== Session de peinture (usage moyen) ===");
const usageResult1 = recordUsage(acryliqueBleu);

console.log(usageResult1.message);
// Sortie: "Session enregistrée : -12%. Reste : 253% (~21 sessions)"

// Mise à jour du stock
acryliqueBleu.quantity = usageResult1.newQuantity; // 253%

// ===== EXEMPLE 4 : Usage personnalisé (grosse session) =====

console.log("\n=== Grosse session de peinture (20% utilisés) ===");
const usageResult2 = recordUsage(acryliqueBleu, 20);

console.log(usageResult2.message);
// Sortie: "Session enregistrée : -20%. Reste : 233% (~19 sessions)"

acryliqueBleu.quantity = usageResult2.newQuantity; // 233%

// ===== EXEMPLE 5 : Workflow complet =====

console.log("\n=== Workflow complet sur nouveau stock ===");

let stock: Stock = {
  id: 2,
  name: "Acrylique Rouge",
  quantity: 15,              // Tube presque vide
  unit: 'percentage',
  containerCapacity: 100,
  containersOwned: 1,
  value: 12,
  status: "low",
  lastUpdate: "maintenant",
  category: "Peinture",
  minThreshold: 20,
  maxThreshold: 100,
};

console.log(`État initial: ${stock.quantity}% (${stock.containersOwned} tube)`);
// Sortie: "État initial: 15% (1 tube)"

// Étape 1 : Achat d'1 nouveau tube
console.log("\n1️⃣ Achat d'1 nouveau tube...");
const purchase = purchaseContainers(stock, 1);
stock.quantity = purchase.newQuantity;
stock.containersOwned = purchase.newContainersOwned;
console.log(purchase.message);
// Sortie: "1 tube ajouté. Nouveau total : 115% (2 tubes)"

// Étape 2 : Session de peinture
console.log("\n2️⃣ Session de peinture...");
const usage1 = recordUsage(stock);
stock.quantity = usage1.newQuantity;
console.log(usage1.message);
// Sortie: "Session enregistrée : -12%. Reste : 103% (~8 sessions)"

// Étape 3 : Encore une session
console.log("\n3️⃣ Encore une session...");
const usage2 = recordUsage(stock);
stock.quantity = usage2.newQuantity;
console.log(usage2.message);
// Sortie: "Session enregistrée : -12%. Reste : 91% (~7 sessions)"

console.log(`\n✅ État final: ${stock.quantity}% (${stock.containersOwned} tubes)`);
// Sortie: "État final: 91% (2 tubes)"

// ===== EXEMPLE 6 : Gestion erreur =====

console.log("\n=== Gestion des erreurs ===");

try {
  // Erreur : essayer d'acheter 0 tube
  purchaseContainers(stock, 0);
} catch (error) {
  console.error("❌ Erreur:", (error as Error).message);
  // Sortie: "❌ Erreur: Le nombre de containers doit être positif"
}

try {
  // Erreur : essayer d'utiliser une quantité négative
  recordUsage(stock, -10);
} catch (error) {
  console.error("❌ Erreur:", (error as Error).message);
  // Sortie: "❌ Erreur: La quantité consommée doit être positive"
}

try {
  // Erreur : essayer d'utiliser purchaseContainers sur un stock non-percentage
  const stockKg: Stock = {
    id: 3,
    name: "Farine",
    quantity: 2.5,
    unit: 'kg',
    value: 5,
    status: "optimal",
    lastUpdate: "1j",
    category: "Cellier",
  };
  purchaseContainers(stockKg, 1);
} catch (error) {
  console.error("❌ Erreur:", (error as Error).message);
  // Sortie: "❌ Erreur: purchaseContainers() est réservé aux stocks en pourcentage (tubes, bouteilles)"
}

// ===== EXEMPLE 7 : Calcul des sessions restantes =====

console.log("\n=== Calcul sessions restantes pour différentes quantités ===");

const quantities = [5, 15, 30, 65, 90, 150, 250];

quantities.forEach(qty => {
  const tempStock: Stock = {
    ...acryliqueBleu,
    quantity: qty,
  };
  const usage = recordUsage(tempStock, 0); // Usage 0 pour juste avoir le calcul
  console.log(`${qty}% → ~${usage.remainingSessions} session${usage.remainingSessions > 1 ? 's' : ''}`);
});

// Sortie:
// "5% → ~0 sessions"
// "15% → ~1 session"
// "30% → ~2 sessions"
// "65% → ~5 sessions"
// "90% → ~7 sessions"
// "150% → ~12 sessions"
// "250% → ~20 sessions"

export { acryliqueBleu, stock };
