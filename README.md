# Bore Labs — catalogue et configurateur Artemis

Site statique Vite + Three.js pour présenter les univers Bore Labs : boîtiers, accessoires et décoration autour de la tech et du gaming. Artemis est le premier boîtier disponible et conserve son configurateur 3D.

## Démarrer

```powershell
pnpm install
pnpm dev
```

`pnpm build` produit le site dans `dist/`. Le workflow GitHub Actions publie la branche `main` sur GitHub Pages.

## Structure

- `src/data/catalog.js` : navigation et contenu des univers.
- `src/main.js` : pages, onglets et intégration du configurateur.
- `src/data/artemis-config.js` : options et chemins des modèles Artemis.
- `src/configurator/` et `src/ui/` : état et commandes du configurateur.
- `src/viewer/` : scène Three.js et chargement des GLB.

Les sections Accessoires et Décoration annoncent des collections en préparation. Aucun produit fictif ni action d’achat n’est affiché. La navigation utilise des fragments d’URL (`#boitiers`, `#artemis`, etc.) afin que les sections soient partageables sur GitHub Pages sans routage serveur.

## Modèles 3D

Les fichiers actifs sont dans `public/models/` : `ARTEMIS.glb` (assemblage initial), `BASE.glb` et `COVER.glb`. Les variantes doivent partager l’origine, l’orientation et l’échelle de l’assemblage. Leurs chemins et finitions se configurent dans `src/data/artemis-config.js`.

Le logo Intel fait actuellement partie du maillage et matériau `Capot-1` de la cover. Il suit donc sa couleur. Pour le teinter indépendamment, exportez-le comme maillage ou matériau séparé.

