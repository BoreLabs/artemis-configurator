const modelPath = (file) => `models/${file}`;

export const artemisConfig = {
  product: {
    id: 'artemis-atx',
    name: 'ARTEMIS',
    subtitle: 'Plateforme ATX modulaire',
    productUrl: '',
  },
  colors: [
    { id: 'graphite', name: 'Graphite', value: '#222728' },
    { id: 'white', name: 'Blanc céramique', value: '#e4e6df' },
    { id: 'grey', name: 'Gris signal', value: '#707878' },
    { id: 'blue', name: 'Bleu Artemis', value: '#3479bb' },
  ],
  permanent: [
    {
      id: 'chassis-main',
      name: 'Châssis principal',
      asset: modelPath('artemis_chassis_main.glb'),
      fallback: 'chassis',
    },
  ],
  slots: {
    front: {
      name: 'Panneau avant',
      options: [
        { id: 'standard', name: 'Standard', asset: modelPath('artemis_front_standard.glb'), fallback: 'front-standard' },
        { id: 'mesh', name: 'Mesh', asset: modelPath('artemis_front_mesh.glb'), fallback: 'front-mesh' },
        { id: 'airflow', name: 'Airflow', asset: modelPath('artemis_front_airflow.glb'), fallback: 'front-airflow' },
      ],
    },
    top: {
      name: 'Panneau supérieur',
      options: [
        { id: 'standard', name: 'Standard', asset: modelPath('artemis_top_standard.glb'), fallback: 'top-standard' },
        { id: 'mesh', name: 'Mesh', asset: modelPath('artemis_top_mesh.glb'), fallback: 'top-mesh' },
        { id: 'airflow', name: 'Airflow', asset: modelPath('artemis_top_airflow.glb'), fallback: 'top-airflow' },
        { id: 'radiator-360', name: 'Radiateur 360', asset: modelPath('artemis_top_radiator-360.glb'), fallback: 'top-radiator' },
      ],
    },
  },
  psuShrouds: [
    { id: 'standard', name: 'Standard', asset: modelPath('artemis_psu-shroud_standard.glb'), fallback: 'psu-standard' },
    { id: 'mesh', name: 'Mesh', asset: modelPath('artemis_psu-shroud_mesh.glb'), fallback: 'psu-mesh' },
    { id: 'industrial', name: 'Industrial', asset: modelPath('artemis_psu-shroud_industrial.glb'), fallback: 'psu-industrial' },
    { id: 'minimal', name: 'Minimal', asset: modelPath('artemis_psu-shroud_minimal.glb'), fallback: 'psu-minimal' },
  ],
  psuPositions: [
    { id: 'position-a', name: 'Position A', transform: { position: [0, -1.42, 0.28], rotation: [0, 0, 0] } },
    { id: 'position-b', name: 'Position B', transform: { position: [-0.52, -1.42, 0.18], rotation: [0, Math.PI / 2, 0] } },
    { id: 'position-c', name: 'Position C', transform: { position: [0.42, -1.42, 0.08], rotation: [0, 0, 0] } },
  ],
  accessories: [
    { id: 'handle', name: 'Poignée', asset: modelPath('artemis_accessory_handle.glb'), fallback: 'handle' },
    { id: 'raised-feet', name: 'Pieds rehaussés', asset: modelPath('artemis_accessory_feet-raised.glb'), fallback: 'raised-feet' },
    { id: 'gpu-support', name: 'Support GPU', asset: modelPath('artemis_accessory_gpu-support.glb'), fallback: 'gpu-support' },
    { id: 'cable-channel', name: 'Guide-câbles', asset: modelPath('artemis_accessory_cable-channel.glb'), fallback: 'cable-channel' },
  ],
};

export const defaultConfiguration = {
  caseModel: 'artemis-atx',
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
