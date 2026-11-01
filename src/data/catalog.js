export const sections = ['nouveautes', 'accueil', 'pc', 'setup', 'gadget', 'deco', 'artemis', 'apropos'];
export const mainMenuSections = sections.filter((id) => !['artemis', 'nouveautes', 'apropos'].includes(id));

export const sectionLabels = {
  nouveautes: 'Nouveautés',
  accueil: 'Accueil',
  pc: 'PC & Case',
  setup: 'Setup',
  gadget: 'Gadget',
  deco: 'Decoration',
  artemis: 'Artemis',
  apropos: 'À propos',
};

export const categories = [
  { id: 'nouveautes', title: 'Nouveautés', detail: 'En préparation' },
  { id: 'pc', title: 'PC & Case', detail: 'Artemis · configurateur 3D' },
  { id: 'setup', title: 'Setup', detail: '3 supports à découvrir' },
  { id: 'gadget', title: 'Gadget', detail: 'En préparation' },
  { id: 'deco', title: 'Decoration', detail: 'En préparation' },
];

export const setupConcepts = [
  { id: 'casque', title: 'Support de casque', image: 'assets/setup-casque-concept.jpg' },
  { id: 'clavier', title: 'Support de clavier', image: 'assets/setup-clavier-concept.jpg' },
  { id: 'souris', title: 'Support de souris', image: 'assets/setup-souris-concept.jpg' },
];

