import './style.css';
import { artemisConfig, defaultConfiguration } from './data/artemis-config.js';
import { evaluateCompatibility } from './configurator/compatibility.js';
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
      <div class="viewer-footer"><span id="asset-status">Aperçu de conception</span><button id="reset-button" type="button">Réinitialiser</button></div>
    </section>
    <aside class="configuration-panel">
      <div class="panel-intro"><p class="eyebrow">Bore Labs / 001</p><h1>ARTEMIS <span>ATX</span></h1><p>Composez votre boîtier, pièce par pièce.</p></div>
      <div id="compatibility-status" class="compatibility-status" role="status"></div>
      <div id="controls" class="controls"></div>
      <a id="product-link" class="product-link is-disabled" href="#" aria-disabled="true">Voir les pièces disponibles <span>↗</span></a>
    </aside>
  </main>`;

const viewer = createViewer(document.querySelector('#viewer'));
const store = createConfiguratorStore(defaultConfiguration);
const controls = document.querySelector('#controls');
const status = document.querySelector('#compatibility-status');
const productLink = document.querySelector('#product-link');

function updateInterface(configuration) {
  viewer.render(configuration, artemisConfig);
  renderControls(controls, configuration, artemisConfig, store);

  const compatibility = evaluateCompatibility(configuration);
  status.className = `compatibility-status ${compatibility.compatible ? 'is-compatible' : 'has-conflict'}`;
  status.textContent = compatibility.compatible ? 'Configuration compatible' : compatibility.conflicts[0];

  if (artemisConfig.product.productUrl) {
    productLink.href = artemisConfig.product.productUrl;
    productLink.classList.remove('is-disabled');
    productLink.setAttribute('aria-disabled', 'false');
  }
}

store.subscribe(updateInterface);
updateInterface(store.getState());
document.querySelector('#reset-button').addEventListener('click', () => store.reset());
