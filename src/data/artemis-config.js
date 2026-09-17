const modelPath = (file) => `models/${file}`;

export const artemisConfig = {
  product: {
    id: 'artemis-atx',
    name: 'ARTEMIS',
    subtitle: 'Plateforme ATX modulaire',
  },
  assembly: {
    name: 'ARTEMIS',
    asset: modelPath('ARTEMIS.glb'),
  },
  bases: [
    {
      id: 'base-standard',
      name: 'BASE',
      asset: modelPath('BASE.glb'),
    },
  ],
  cover: {
    id: 'cover-standard',
    name: 'COVER',
    asset: modelPath('COVER.glb'),
  },
  colors: [
    { id: 'bleu-glacier', name: 'Bleu glacier', value: '#5ca9e6' },
    { id: 'noir-graphite', name: 'Noir graphite', value: '#171b22' },
    { id: 'blanc-ceramique', name: 'Blanc céramique', value: '#e7eaec' },
    { id: 'gris-titane', name: 'Gris titane', value: '#8d99a4' },
    { id: 'rouge-signal', name: 'Rouge signal', value: '#bd3037' },
    { id: 'vert-foret', name: 'Vert forêt', value: '#314f45' },
    { id: 'sable-mineral', name: 'Sable minéral', value: '#b9aa90' },
  ],
};

export const defaultConfiguration = {
  base: 'base-standard',
  cover: true,
  colors: {
    base: 'noir-graphite',
    cover: 'bleu-glacier',
  },
};

export function findOption(options, id) {
  return options.find((option) => option.id === id);
}
