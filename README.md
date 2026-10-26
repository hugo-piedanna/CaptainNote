# Captain Note

Extension Chrome et Firefox pour noter les coasters de [Captain Coaster](https://captaincoaster.com) sur tes propres critères. La moyenne pondérée, arrondie au demi-point, est envoyée comme ta note sur 5 : les utilisateurs sans extension voient une note normale.

Tout reste dans le navigateur (`storage.local`). Aucun serveur, aucune donnée collectée.

## Développer

```bash
npm install
npm run dev            # ouvre Chrome avec l'extension, rechargement à chaud
npm run dev:firefox    # idem dans Firefox
npm test               # tests unitaires (logique de note et adaptateur Captain Coaster)
npm run compile        # vérification TypeScript
```

Charger le build à la main : `npm run build`, puis `chrome://extensions` → Mode développeur → « Charger l'extension non empaquetée » → `.output/chrome-mv3`. Pour Firefox : `npm run build:firefox`, puis `about:debugging` → « Charger un module temporaire » → `.output/firefox-mv2/manifest.json`.

Publier : `npm run zip` et `npm run zip:firefox` créent les archives à déposer dans `.output/`. Le zip Firefox inclut aussi les sources, demandées par la relecture de Mozilla.

## Structure

| Fichier | Rôle |
| --- | --- |
| `lib/rating.ts` | Critères par défaut, moyenne pondérée, arrondi au demi-point. Aucune API navigateur. |
| `lib/captain.ts` | **Tout ce qui dépend du HTML de Captain Coaster.** Si le site change, c'est le seul fichier à corriger. |
| `lib/store.ts` | Stockage local, export et import de sauvegarde (avec validation). |
| `lib/stars.ts` | Saisie en demi-étoiles, accessible au clavier (flèches, Suppr). |
| `entrypoints/captain.content.ts` | Panneau « Ta note détaillée » sous les étoiles, sur chaque page coaster. |
| `entrypoints/options/` | Réglages : critères et poids, liste des notes, sauvegarde. |
| `entrypoints/background.ts` | Ouvre les réglages depuis le bouton de la barre d'outils. |

## Comment la note part sur Captain Coaster

Vérifié dans le dépôt open source `captain-coaster/captain-coaster` (octobre 2026) :

1. **Voie principale** : l'extension clique sur le widget d'étoiles du site, exactement à l'endroit qui correspond à la valeur. Le code du site fait le reste (jeton CSRF, requête, affichage, boutons date et suppression), puis émet `rating:created` ou `rating:updated`, que l'extension attend pour confirmer.
2. **Repli** (écrans tactiles, où le site écoute le toucher et non le clic) : la même requête que le site, `POST /{langue}/ratings/coasters/{id}/edit` avec `value`, `_token` et `X-Requested-With: XMLHttpRequest`, depuis la session de l'utilisateur.

Valeurs acceptées par le site : 0,5 à 5 par pas de 0,5.

## Si ça casse

Captain Coaster est activement développé. Les signes d'une casse : le panneau n'apparaît plus, ou « Envoyer » renvoie une erreur. À vérifier dans le dépôt du site :

- `templates/Coaster/_rating_widget.html.twig` : attributs `data-rating-*` et `data-csrf-protection-token-value`
- `assets/controllers/rating_controller.js` : calcul de la valeur au clic, événements émis
- `src/Controller/RatingCoasterController.php` : route et paramètres

Puis ajuster `SELECTORS` et `sendToCaptain` dans `lib/captain.ts`, et les tests de `tests/captain.test.ts` qui reproduisent ce widget.

## Pistes

- Synchroniser critères et notes entre appareils (`storage.sync` pour les critères, quota trop juste pour les notes ; sinon un petit backend).
- Traductions anglais, espagnol, allemand (les langues du site).
- Pré-remplir les critères depuis les tags de l'avis (Airtimes, Capacité…).
- Afficher la note détaillée dans la liste « Mes notes » du site.
