const modelPath = (file) => `models/${file}`;

export const swapConfig = {
  product: {
    id: 'swap-atx',
    name: 'SWAP',
    subtitle: 'Plateforme ATX modulaire',
    productUrl: '',
  },
  colors: [
    { id: 'graphite', name: 'Graphite', value: '#222728' },
    { id: 'white', name: 'Blanc céramique', value: '#e4e6df' },
    { id: 'grey', name: 'Gris signal', value: '#707878' },
    { id: 'red', name: 'Rouge Bore', value: '#d33a2c' },
  ],
  permanent: [
    {
      id: 'chassis-main',
      name: 'Châssis principal',
      asset: modelPath('swap_chassis_main.glb'),
      fallback: 'chassis',
    },
  ],
  slots: {
    front: {
      name: 'Panneau avant',
      options: [
        { id: 'standard', name: 'Standard', asset: modelPath('swap_front_standard.glb'), fallback: 'front-standard' },
        { id: 'mesh', name: 'Mesh', asset: modelPath('swap_front_mesh.glb'), fallback: 'front-mesh' },
        { id: 'airflow', name: 'Airflow', asset: modelPath('swap_front_airflow.glb'), fallback: 'front-airflow' },
      ],
    },
    top: {
      name: 'Panneau supérieur',
      options: [
        { id: 'standard', name: 'Standard', asset: modelPath('swap_top_standard.glb'), fallback: 'top-standard' },
        { id: 'mesh', name: 'Mesh', asset: modelPath('swap_top_mesh.glb'), fallback: 'top-mesh' },
        { id: 'airflow', name: 'Airflow', asset: modelPath('swap_top_airflow.glb'), fallback: 'top-airflow' },
        { id: 'radiator-360', name: 'Radiateur 360', asset: modelPath('swap_top_radiator-360.glb'), fallback: 'top-radiator' },
      ],
    },
  },
  psuShrouds: [
    { id: 'standard', name: 'Standard', asset: modelPath('swap_psu-shroud_standard.glb'), fallback: 'psu-standard' },
    { id: 'mesh', name: 'Mesh', asset: modelPath('swap_psu-shroud_mesh.glb'), fallback: 'psu-mesh' },
    { id: 'industrial', name: 'Industrial', asset: modelPath('swap_psu-shroud_industrial.glb'), fallback: 'psu-industrial' },
    { id: 'minimal', name: 'Minimal', asset: modelPath('swap_psu-shroud_minimal.glb'), fallback: 'psu-minimal' },
  ],
  psuPositions: [
    { id: 'position-a', name: 'Position A', transform: { position: [0, -1.42, 0.28], rotation: [0, 0, 0] } },
    { id: 'position-b', name: 'Position B', transform: { position: [-0.52, -1.42, 0.18], rotation: [0, Math.PI / 2, 0] } },
    { id: 'position-c', name: 'Position C', transform: { position: [0.42, -1.42, 0.08], rotation: [0, 0, 0] } },
  ],
  accessories: [
    { id: 'handle', name: 'Poignée', asset: modelPath('swap_accessory_handle.glb'), fallback: 'handle' },
    { id: 'raised-feet', name: 'Pieds rehaussés', asset: modelPath('swap_accessory_feet-raised.glb'), fallback: 'raised-feet' },
    { id: 'gpu-support', name: 'Support GPU', asset: modelPath('swap_accessory_gpu-support.glb'), fallback: 'gpu-support' },
    { id: 'cable-channel', name: 'Guide-câbles', asset: modelPath('swap_accessory_cable-channel.glb'), fallback: 'cable-channel' },
  ],
};

export const defaultConfiguration = {
  caseModel: 'swap-atx',
  color: 'graphite',
  slots: {
    front: 'mesh',
    top: 'airflow',
  },
  psuShroud: {
    style: 'industrial',
    position: 'position-a',
  },
  accessories: {
    handle: true,
    'raised-feet': false,
    'gpu-support': false,
    'cable-channel': false,
  },
};

export function findOption(options, id) {
  return options.find((option) => option.id === id);
}
