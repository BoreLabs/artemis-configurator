# Bore Labs ARTEMIS Configurator

Application statique Vite + Three.js pour configurer le boîtier modulaire ARTEMIS.

## Démarrer

```powershell
pnpm install
pnpm dev
```

Ouvrir l'adresse affichée par Vite. Pour produire le site statique, exécuter `pnpm build`; le résultat est dans `dist/` et peut être publié sur GitHub Pages.

## Ajouter les modèles de production

Déposer les fichiers GLB dans `public/models/` en respectant les noms définis dans `src/data/artemis-config.js`, par exemple `artemis_front_mesh.glb`. Le configurateur tentera alors automatiquement de charger le modèle en remplacement de l'aperçu de conception.

Les variantes interchangeables doivent partager l'origine, l'orientation et l'échelle de l'assemblage SolidWorks. N'ajoutez pas de correctifs de position au JavaScript pour compenser un export mal aligné. Les matériaux qui peuvent changer de couleur doivent être nommés `CASE_PAINT` dans les GLB.

Les options, leurs chemins de modèles, les couleurs et les liens produits sont centralisés dans `src/data/artemis-config.js`. Les règles métier restent dans `src/configurator/compatibility.js`.

## Publier sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` compile le site et publie `dist/` à chaque envoi sur la branche `main`. Connectez ensuite ce dépôt à un dépôt GitHub, poussez `main`, puis choisissez **GitHub Actions** dans **Settings → Pages**. GitHub fournira l'URL de publication dans l'exécution du workflow.
