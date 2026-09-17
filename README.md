# Bore Labs ARTEMIS Configurator

Application statique Vite + Three.js pour configurer le boîtier modulaire ARTEMIS.

## Démarrer

```powershell
pnpm install
pnpm dev
```

Ouvrir l'adresse affichée par Vite. Pour produire le site statique, exécuter `pnpm build`; le résultat est dans `dist/` et peut être publié sur GitHub Pages.

## Modèles de production

Les modèles GLB actifs sont rangés dans `public/models/` :

- `ARTEMIS.glb` : assemblage complet affiché au chargement.
- `BASE.glb` : base du boîtier, prête à accueillir de futures variantes.
- `COVER.glb` : cover affichée ou retirée avec son interrupteur.

Les variantes interchangeables doivent partager l'origine, l'orientation et l'échelle de l'assemblage SolidWorks. Les options et leurs chemins de modèles sont centralisés dans `src/data/artemis-config.js`.

La BASE et la COVER disposent chacune de sept finitions : Bleu glacier, Noir graphite, Blanc céramique, Gris titane, Rouge signal, Vert forêt et Sable minéral. Le logo Intel fait actuellement partie du maillage et du matériau unique `Capot-1` de la cover : il suit donc sa couleur. Pour le teinter indépendamment, exportez-le comme un maillage ou matériau séparé, par exemple `LOGO_INTEL`.

## Publier sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` compile le site et publie `dist/` à chaque envoi sur la branche `main`. Connectez ensuite ce dépôt à un dépôt GitHub, poussez `main`, puis choisissez **GitHub Actions** dans **Settings → Pages**. GitHub fournira l'URL de publication dans l'exécution du workflow.
