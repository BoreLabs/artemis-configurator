# Bore Labs — catalogue et configurateur Artemis

Site statique Vite + Three.js pour présenter les univers Bore Labs : PC, Boîtier, Setup, Gadget et Déco. Artemis se trouve dans la catégorie PC et conserve son configurateur 3D.

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

L’interface utilise la police Orbitron pour la signature « BORE LABS » et des polices système pour le reste. La signature se remplit de bleu de bas en haut au survol et ouvre la page À propos. Cette page présente le créateur et ses liens GitHub et GrabCAD ; les emplacements YouTube et Discord restent en attente de leurs URL. Orbitron est une approximation du lettrage présent sur la bannière fournie, dont la police d’origine n’est pas identifiable avec certitude depuis une image. Le module Three.js est chargé seulement lorsque le configurateur Artemis est ouvert, pour garder l’accueil léger. Les animations sont désactivées lorsque le navigateur demande une réduction du mouvement.

Les sections Boîtier, Gadget et Déco annoncent des collections en préparation. Setup présente trois bandeaux conceptuels (supports de casque, clavier et souris) illustrés par des images IA provisoires sous `public/assets/`. Ces images ne sont pas des représentations de produits définitifs. Aucun produit fictif n’est présenté comme disponible à l’achat. La navigation utilise des fragments d’URL (`#pc`, `#setup`, `#artemis`, etc.) afin que les sections soient partageables sur GitHub Pages sans routage serveur.

## Modèles 3D

Les fichiers actifs sont dans `public/models/` : `ARTEMIS.glb` (assemblage initial), `BASE.glb` et `COVER.glb`. Les variantes doivent partager l’origine, l’orientation et l’échelle de l’assemblage. Leurs chemins et finitions se configurent dans `src/data/artemis-config.js`.

Le logo Intel fait actuellement partie du maillage et matériau `Capot-1` de la cover. Il suit donc sa couleur. Pour le teinter indépendamment, exportez-le comme maillage ou matériau séparé.

