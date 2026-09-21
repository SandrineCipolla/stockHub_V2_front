Audit rapide du module IA côté frontend.

Chercher dans src/ (récursivement) :

- Fichiers contenant "AIAssistant", "SmartSuggestions",
  "StockPrediction", "aiService"
- Fichiers contenant "prediction", "suggest", "/api/ai"

Pour chaque fichier trouvé :

1. Chemin complet
2. Est-il importé quelque part ? (utilisé ou orphelin ?)
3. Vers quel(s) endpoint(s) backend il appelle
4. Y a-t-il des données mockées en dur ?

Produire un résumé dans audit-results/ia-front-audit.md
