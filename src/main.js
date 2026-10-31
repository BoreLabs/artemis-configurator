import './style.css';
import { sections, sectionLabels, categories } from './data/catalog.js';
import { artemisConfig, defaultConfiguration } from './data/artemis-config.js';
import { createConfiguratorStore } from './configurator/state.js';
import { renderControls } from './ui/controls.js';

const app = document.querySelector('#app');

function goButton(id, label, className = 'text-button') {
  return `<button type="button" class="${className} action-button" data-go="${id}"><span class="button-label">${label}</span><span class="button-icon" aria-hidden="true">↗</span></button>`;
}

const cards = categories.map(({ id, title, detail }) => `
  <button class="category-card" type="button" data-go="${id}">
    <span class="card-arrow" aria-hidden="true">↗</span>
    <strong>${title}</strong>
    <span class="card-bottom">${detail}</span>
  </button>
`).join('');

function categoryPanel({ id, title }) {
  const content = id === 'boitiers' ? `
    <div class="category-feature has-product">
      <div class="feature-photo" role="img" aria-label="Atelier Bore Labs"></div>
      <div class="feature-copy">
        <h2>Artemis</h2>
        <p>Boîtier modulaire personnalisable en 3D.</p>
        ${goButton('artemis', 'Configurer Artemis', 'primary-button')}
      </div>
    </div>` : `<div class="coming-soon">En préparation</div>`;

  return `<section id="panel-${id}" class="page category-page" role="tabpanel" aria-labelledby="tab-${id}" hidden>
    <div class="category-intro"><h1>${title}<b>.</b></h1></div>
    ${content}
  </section>`;
}

app.innerHTML = `
  <header class="site-header">
    <button class="wordmark" type="button" data-go="accueil" aria-label="Bore Labs, accueil"><span class="brand-symbol">B<span>·</span></span> BORE <em>LABS</em></button>
    <nav class="main-nav" aria-label="Navigation principale" role="tablist">
      ${sections.map((id) => `<button id="tab-${id}" class="nav-link ${id === 'artemis' ? 'nav-featured' : ''}" type="button" role="tab" aria-controls="panel-${id}" data-go="${id}"><span>${sectionLabels[id]}</span></button>`).join('')}
    </nav>
  </header>
  <main>
    <section id="panel-accueil" class="page home-page" role="tabpanel" aria-labelledby="tab-accueil">
      <div class="hero">
        <div class="hero-copy">
          <h1>DONNEZ<br>FORME À <span>VOTRE</span><br>UNIVERS<b>.</b></h1>
          <p class="hero-description">PC, boîtiers et objets pour votre setup.</p>
          <div class="hero-actions">${goButton('boitiers', 'Explorer', 'primary-button')}${goButton('artemis', 'Artemis')}</div>
        </div>
        <div class="hero-image" role="img" aria-label="Atelier Bore Labs"><div class="image-caption"><strong>ARTEMIS</strong></div></div>
      </div>
      <section class="catalog-preview" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Collections<b>.</b></h2>
        <div class="category-grid">${cards}</div>
      </section>
    </section>
    ${categories.map(categoryPanel).join('')}
    <section id="panel-artemis" class="page artemis-page" role="tabpanel" aria-labelledby="tab-artemis" hidden>
      <div class="product-bar"><div><h1>ARTEMIS <span>CONFIGURATEUR 3D</span></h1></div>${goButton('boitiers', 'Boîtier', 'back-button')}</div>
      <div class="configurator-layout">
        <section class="viewer-shell" aria-label="Aperçu 3D du boîtier configuré">
          <div class="viewer-copy"><span>VUE INTERACTIVE / 360°</span><p>Glisser pour tourner · Molette pour zoomer</p></div>
          <div id="viewer" class="viewer"></div>
          <div class="viewer-footer"><span id="asset-status">Chargement d’Artemis…</span><button id="reset-button" type="button">Réinitialiser</button></div>
        </section>
        <aside class="configuration-panel">
          <div class="panel-intro"><h2>Votre Artemis<b>.</b></h2><p>Choisissez les finitions de votre boîtier et explorez le résultat en 3D.</p></div>
          <div id="controls" class="controls"></div>
        </aside>
      </div>
    </section>
  </main>
  <footer class="site-footer"><span>© BORE LABS</span></footer>`;

const store = createConfiguratorStore(defaultConfiguration);
const controls = document.querySelector('#controls');
const assetStatus = document.querySelector('#asset-status');
let viewer;
let viewerLoading;

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

function ensureViewer() {
  if (viewer || viewerLoading) return;
  assetStatus.textContent = 'Chargement du configurateur…';
  viewerLoading = import('./viewer/scene.js')
    .then(({ createViewer }) => {
      if (currentSection() !== 'artemis') return;
      viewer = createViewer(document.querySelector('#viewer'), (message) => {
        assetStatus.textContent = message;
      });
      viewer.render(store.getState(), artemisConfig);
    })
    .catch(() => {
      assetStatus.textContent = 'Le configurateur est momentanément indisponible.';
    })
    .finally(() => { viewerLoading = null; });
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
  if (selected === 'artemis') ensureViewer();
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
  target.click();
  target.focus();
});

window.addEventListener('hashchange', showSection);
showSection();

