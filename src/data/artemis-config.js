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
};

export const defaultConfiguration = {
  base: 'base-standard',
  cover: true,
};

export function findOption(options, id) {
  return options.find((option) => option.id === id);
}
