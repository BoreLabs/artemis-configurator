import './style.css';
import { artemisConfig, defaultConfiguration } from './data/artemis-config.js';
import { createConfiguratorStore } from './configurator/state.js';
import { createViewer } from './viewer/scene.js';
import { renderControls } from './ui/controls.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="site-header">
    <a class="wordmark" href="./" aria-label="Bore Labs, accueil"><span>BORE</span> LABS</a>
    <p>ARTEMIS / CONFIGURATOR <sup>01</sup></p>
  </header>
  <main class="configurator-layout">
    <section class="viewer-shell" aria-label="Aperçu 3D du boîtier configuré">
      <div class="viewer-copy"><span>Vue interactive</span><p>Glisser pour tourner · Molette pour zoomer</p></div>
      <div id="viewer" class="viewer"></div>
      <div class="viewer-footer"><span id="asset-status">Chargement d’ARTEMIS…</span><button id="reset-button" type="button">Réinitialiser</button></div>
    </section>
    <aside class="configuration-panel">
      <div class="panel-intro"><p class="eyebrow">Bore Labs / 001</p><h1>ARTEMIS <span>ITX</span></h1><p>Configurez la base et la cover de votre boîtier.</p></div>
      <div id="controls" class="controls"></div>
    </aside>
  </main>`;

const assetStatus = document.querySelector('#asset-status');
const viewer = createViewer(document.querySelector('#viewer'), (message) => {
  assetStatus.textContent = message;
});
const store = createConfiguratorStore(defaultConfiguration);
const controls = document.querySelector('#controls');

function updateInterface(configuration) {
  viewer.render(configuration, artemisConfig);
  renderControls(controls, configuration, artemisConfig, store);
}

store.subscribe(updateInterface);
updateInterface(store.getState());
document.querySelector('#reset-button').addEventListener('click', () => store.reset());
