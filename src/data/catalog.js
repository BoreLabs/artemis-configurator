export const sections = ['nouveautes', 'accueil', 'pc', 'boitiers', 'setup', 'gadget', 'deco', 'artemis', 'apropos'];
export const mainMenuSections = sections.filter((id) => !['artemis', 'nouveautes', 'apropos'].includes(id));

export const sectionLabels = {
  nouveautes: 'Nouveauté',
  accueil: 'Accueil',
  pc: 'PC',
  boitiers: 'Boîtier',
  setup: 'Setup',
  gadget: 'Gadget',
  deco: 'Déco',
  artemis: 'Artemis',
  apropos: 'À propos',
};

export const categories = [
  { id: 'pc', title: 'PC', detail: 'Artemis · configurateur 3D' },
  { id: 'boitiers', title: 'Boîtier', detail: 'En préparation' },
  { id: 'setup', title: 'Setup', detail: '3 supports à découvrir' },
  { id: 'gadget', title: 'Gadget', detail: 'En préparation' },
  { id: 'deco', title: 'Déco', detail: 'En préparation' },
];

export const setupConcepts = [
  { id: 'casque', title: 'Support de casque', image: 'assets/setup-casque-concept.jpg' },
  { id: 'clavier', title: 'Support de clavier', image: 'assets/setup-clavier-concept.jpg' },
  { id: 'souris', title: 'Support de souris', image: 'assets/setup-souris-concept.jpg' },
];

