import './style.css';
import { sections, categories } from './data/catalog.js';
import { artemisConfig, defaultConfiguration } from './data/artemis-config.js';
import { createConfiguratorStore } from './configurator/state.js';
import { createViewer } from './viewer/scene.js';
import { renderControls } from './ui/controls.js';

const app = document.querySelector('#app');
const goButton = (id, label, className = 'text-button') => `<button type="button" class="${className}" data-go="${id}">${label} <span aria-hidden="true">↗</span></button>`;
const cards = categories.map(({ id, number, title, description, detail }) => `<button class="category-card" type="button" data-go="${id}"><span class="card-top">${number} / UNIVERS <span aria-hidden="true">↗</span></span><strong>${title}</strong><span class="card-description">${description}</span><span class="card-bottom">${detail}</span></button>`).join('');

app.innerHTML = `
  <header class="site-header">
    <button class="wordmark" type="button" data-go="accueil" aria-label="Bore Labs, accueil"><span class="brand-symbol">B<span>·</span></span> BORE <em>LABS</em></button>
    <nav class="main-nav" aria-label="Navigation principale" role="tablist">${sections.map((id) => `<button id="tab-${id}" class="nav-link ${id === 'artemis' ? 'nav-featured' : ''}" type="button" role="tab" aria-controls="panel-${id}" data-go="${id}">${id === 'boitiers' ? 'Boîtiers' : id === 'decoration' ? 'Décoration' : id[0].toUpperCase() + id.slice(1)}</button>`).join('')}</nav>
    <span class="header-note">DES OBJETS POUR VOTRE SETUP <i></i></span>
  </header>
  <main>
    <section id="panel-accueil" class="page home-page" role="tabpanel" aria-labelledby="tab-accueil">
      <div class="hero"><div class="hero-copy"><p class="eyebrow">BORE LABS / L’ATELIER DU SETUP</p><h1>DONNEZ<br>FORME À <span>VOTRE</span><br>UNIVERS<b>.</b></h1><p class="hero-description">Boîtiers, accessoires et objets décoratifs pour ceux qui font de la tech un espace à part entière.</p><div class="hero-actions">${goButton('boitiers', 'Explorer les créations', 'primary-button')}${goButton('artemis', 'Découvrir Artemis')}</div></div><div class="hero-image" role="img" aria-label="Boîtier Artemis dans un atelier"><div class="image-caption"><span>01 / 01</span><strong>ARTEMIS</strong><span>BOÎTIER MODULAIRE</span></div></div><span class="hero-index">BL—001 / CRÉER. CONFIGURER. PERSONNALISER.</span></div>
      <section class="catalog-preview"><div class="section-heading"><div><p class="eyebrow">NOS UNIVERS</p><h2>Un espace pour chaque idée<b>.</b></h2></div><p>Une même envie : créer des objets qui trouvent naturellement leur place dans votre setup.</p></div><div class="category-grid">${cards}</div></section>
      <section class="feature-strip"><span>À LA UNE / 001</span><strong>ARTEMIS</strong><p>Le premier boîtier de la collection. Explorez sa structure et ses finitions en 3D.</p>${goButton('artemis', 'Ouvrir le configurateur')}</section>
    </section>
    ${categories.map(({ id, number, title, description }) => `<section id="panel-${id}" class="page category-page" role="tabpanel" aria-labelledby="tab-${id}" hidden><div class="category-intro"><p class="eyebrow">BORE LABS / UNIVERS ${number}</p><h1>${title}<b>.</b></h1><p>${description}</p></div><div class="category-feature ${id === 'boitiers' ? 'has-product' : ''}">${id === 'boitiers' ? `<div class="feature-photo" role="img" aria-label="Boîtier Artemis"></div><div class="feature-copy"><span class="feature-kicker">MODÈLE 001 / CONFIGURABLE EN 3D</span><h2>ARTEMIS</h2><p>Un boîtier modulaire à personnaliser selon votre espace. Choisissez la couleur de la base et de la cover, puis observez le résultat sous tous les angles.</p>${goButton('artemis', 'Configurer Artemis', 'primary-button')}</div>` : `<div class="upcoming-mark" aria-hidden="true">${number}</div><div class="feature-copy"><span class="feature-kicker">BORE LABS / À SUIVRE</span><h2>La collection prend forme.</h2><p>De nouvelles créations viendront enrichir cet univers. Retrouvez dès maintenant Artemis, notre premier boîtier configurable.</p>${goButton('artemis', 'Découvrir Artemis')}</div>`}</div></section>`).join('')}
    <section id="panel-artemis" class="page artemis-page" role="tabpanel" aria-labelledby="tab-artemis" hidden><div class="product-bar"><div><span class="eyebrow">BOÎTIERS / 001</span><h1>ARTEMIS <span>CONFIGURATEUR 3D</span></h1></div>${goButton('boitiers', 'Tous les boîtiers', 'back-button')}</div><div class="configurator-layout"><section class="viewer-shell" aria-label="Aperçu 3D du boîtier configuré"><div class="viewer-copy"><span>VUE INTERACTIVE / 360°</span><p>Glisser pour tourner · Molette pour zoomer</p></div><div id="viewer" class="viewer"></div><div class="viewer-footer"><span id="asset-status">Chargement d’Artemis…</span><button id="reset-button" type="button">Réinitialiser</button></div></section><aside class="configuration-panel"><div class="panel-intro"><p class="eyebrow">PERSONNALISATION / ARTEMIS</p><h2>Votre Artemis<b>.</b></h2><p>Choisissez les finitions de votre boîtier et explorez le résultat en 3D.</p></div><div id="controls" class="controls"></div></aside></div></section>
  </main><footer class="site-footer"><span>© BORE LABS</span><span>BOÎTIERS · ACCESSOIRES · DÉCORATION</span>${goButton('accueil', 'Accueil')}</footer>`;

const store = createConfiguratorStore(defaultConfiguration);
const controls = document.querySelector('#controls');
const assetStatus = document.querySelector('#asset-status');
let viewer;

function updateConfiguration(configuration) {
  if (viewer) viewer.render(configuration, artemisConfig);
  renderControls(controls, configuration, artemisConfig, store);
}
store.subscribe(updateConfiguration);
updateConfiguration(store.getState());
document.querySelector('#reset-button').addEventListener('click', () => store.reset());

function currentSection() {
  const id = window.location.hash.slice(1);
  return sections.includes(id) ? id : 'accueil';
}

function showSection() {
  const selected = currentSection();
  sections.forEach((id) => {
    const active = id === selected;
    document.querySelector(`#panel-${id}`).hidden = !active;
    const tab = document.querySelector(`#tab-${id}`);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (selected === 'artemis' && !viewer) {
    viewer = createViewer(document.querySelector('#viewer'), (message) => { assetStatus.textContent = message; });
    viewer.render(store.getState(), artemisConfig);
  }
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => {
  const id = button.dataset.go;
  if (window.location.hash === `#${id}`) showSection();
  else window.location.hash = id;
}));
document.querySelector('.main-nav').addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = sections.indexOf(currentSection());
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + sections.length) % sections.length;
  const target = document.querySelector(`#tab-${sections[next]}`);
  target.click(); target.focus();
});
window.addEventListener('hashchange', showSection);
showSection();

