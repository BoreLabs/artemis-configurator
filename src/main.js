import './style.css';
import { sections, mainMenuSections, sectionLabels, categories, setupConcepts } from './data/catalog.js';
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
  let content = `<div class="coming-soon">En préparation</div>`;

  if (id === 'pc') {
    content = `<div class="band-list">
      <button class="product-band is-action" type="button" data-go="artemis">
        <span class="band-media"><img src="${import.meta.env.BASE_URL}assets/artemis-workshop-oak.png" alt="" loading="lazy" decoding="async" /></span>
        <span class="band-copy"><span class="band-kicker">PC / CONFIGURATEUR 3D</span><strong>Artemis</strong><span class="band-detail">Configurer Artemis <span aria-hidden="true">↗</span></span></span>
      </button>
    </div>`;
  }

  if (id === 'setup') {
    content = `<div class="band-list">${setupConcepts.map(({ id: conceptId, title: conceptTitle, image }) => `
      <article class="product-band is-preview" id="setup-${conceptId}">
        <div class="band-media"><img src="${import.meta.env.BASE_URL}${image}" alt="" loading="lazy" decoding="async" /></div>
        <div class="band-copy"><span class="band-kicker">SETUP / VISUEL CONCEPTUEL</span><h2>${conceptTitle}</h2><span class="band-detail">À personnaliser prochainement</span></div>
      </article>`).join('')}</div>`;
  }

  return `<section id="panel-${id}" class="page category-page" hidden>
    <div class="category-intro"><h1>${title}<b>.</b></h1></div>
    ${content}
  </section>`;
}

app.innerHTML = `
  <header class="site-header">
    <button class="wordmark" type="button" data-go="accueil" aria-label="Borlabs, accueil"><img class="brand-logo" src="${import.meta.env.BASE_URL}assets/borlabs-logo.png" alt="" width="48" height="48" /> <span>BORLABS</span></button>
    <nav class="main-nav" aria-label="Navigation principale">
      ${mainMenuSections.map((id) => `<button id="tab-${id}" class="nav-link" type="button" aria-controls="panel-${id}" data-go="${id}"><span>${sectionLabels[id]}</span></button>`).join('')}
    </nav>
    <button id="tab-nouveautes" class="nav-link novelty-link" type="button" aria-controls="panel-nouveautes" data-go="nouveautes"><span class="nav-flame" aria-hidden="true">🔥</span><span>Nouveauté</span></button>
  </header>
  <main>
    <section id="panel-accueil" class="page home-page">
      <div class="hero">
        <div class="hero-copy">
          <h1>DONNEZ<br>FORME À <span>VOTRE</span><br>UNIVERS<b>.</b></h1>
          <p class="hero-description">PC, boîtiers et objets pour votre setup.</p>
          <div class="hero-actions">${goButton('pc', 'Explorer', 'primary-button')}</div>
        </div>
        <div class="hero-image" role="img" aria-label="Atelier Borlabs"></div>
      </div>
      <section class="catalog-preview" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Collections<b>.</b></h2>
        <div class="category-grid">${cards}</div>
      </section>
    </section>
    ${categoryPanel({ id: 'nouveautes', title: 'Nouveauté' })}
    ${categories.map(categoryPanel).join('')}
    <section id="panel-artemis" class="page artemis-page" aria-label="Configurateur Artemis" hidden>
      <div class="product-bar"><div><h1>ARTEMIS <span>CONFIGURATEUR 3D</span></h1></div>${goButton('pc', 'PC', 'back-button')}</div>
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
  <footer class="site-footer"><span>© BORLABS</span></footer>`;

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
    document.querySelector(`#panel-${id}`).hidden = id !== selected;
  });
  mainMenuSections.forEach((id) => {
    const tab = document.querySelector(`#tab-${id}`);
    if (id === selected || (selected === 'artemis' && id === 'pc')) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
  const noveltyTab = document.querySelector('#tab-nouveautes');
  if (selected === 'nouveautes') noveltyTab.setAttribute('aria-current', 'page');
  else noveltyTab.removeAttribute('aria-current');
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
  const index = Math.max(0, mainMenuSections.indexOf(currentSection() === 'artemis' ? 'pc' : currentSection()));
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? mainMenuSections.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + mainMenuSections.length) % mainMenuSections.length;
  const target = document.querySelector(`#tab-${mainMenuSections[next]}`);
  target.click();
  target.focus();
});

window.addEventListener('hashchange', showSection);
showSection();

