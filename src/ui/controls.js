import { reasonForOption } from '../configurator/compatibility.js';

function choiceButton({ label, active, disabled, reason, data }) {
  return `<button class="choice ${active ? 'is-active' : ''}" type="button" ${disabled ? 'disabled' : ''} ${reason ? `title="${reason}"` : ''} ${Object.entries(data).map(([key, value]) => `data-${key}="${value}"`).join(' ')}><span>${label}</span>${disabled ? '<small>Indisponible</small>' : ''}</button>`;
}

function optionChoices(configuration, options, category, key) {
  return options.map((option) => {
    const change = category === 'slot'
      ? { slots: { [key]: option.id } }
      : category === 'psu-style'
        ? { psuShroud: { style: option.id } }
        : { psuShroud: { position: option.id } };
    const reason = reasonForOption(configuration, change);
    const active = category === 'slot'
      ? configuration.slots[key] === option.id
      : category === 'psu-style'
        ? configuration.psuShroud.style === option.id
        : configuration.psuShroud.position === option.id;
    return choiceButton({ label: option.name, active, disabled: Boolean(reason) && !active, reason, data: { action: category, key, value: option.id } });
  }).join('');
}

export function renderControls(root, configuration, catalog, store) {
  const colorChoices = catalog.colors.map((color) => `
    <button class="color-choice ${configuration.color === color.id ? 'is-active' : ''}" type="button" data-action="color" data-value="${color.id}" aria-label="${color.name}" aria-pressed="${configuration.color === color.id}">
      <span style="--swatch:${color.value}"></span><b>${color.name}</b>
    </button>`).join('');

  const accessoryChoices = catalog.accessories.map((accessory) => {
    const next = !configuration.accessories[accessory.id];
    const reason = reasonForOption(configuration, { accessories: { [accessory.id]: next } });
    return `
      <label class="toggle ${reason && next ? 'is-disabled' : ''}" title="${reason}">
        <input type="checkbox" data-action="accessory" data-value="${accessory.id}" ${configuration.accessories[accessory.id] ? 'checked' : ''} ${reason && next ? 'disabled' : ''} />
        <span class="toggle-mark"></span><span>${accessory.name}</span>
      </label>`;
  }).join('');

  root.innerHTML = `
    <section class="control-group">
      <div class="group-heading"><span>01</span><h2>Finition</h2></div>
      <div class="color-grid">${colorChoices}</div>
    </section>
    <section class="control-group">
      <div class="group-heading"><span>02</span><h2>Panneaux</h2></div>
      <p class="control-label">Avant</p><div class="choice-grid">${optionChoices(configuration, catalog.slots.front.options, 'slot', 'front')}</div>
      <p class="control-label">Supérieur</p><div class="choice-grid">${optionChoices(configuration, catalog.slots.top.options, 'slot', 'top')}</div>
    </section>
    <section class="control-group">
      <div class="group-heading"><span>03</span><h2>Cache alimentation</h2></div>
      <p class="control-label">Style</p><div class="choice-grid">${optionChoices(configuration, catalog.psuShrouds, 'psu-style', 'style')}</div>
      <p class="control-label">Position</p><div class="choice-grid">${optionChoices(configuration, catalog.psuPositions, 'psu-position', 'position')}</div>
    </section>
    <section class="control-group">
      <div class="group-heading"><span>04</span><h2>Accessoires</h2></div>
      <div class="toggle-list">${accessoryChoices}</div>
    </section>`;

  root.querySelectorAll('[data-action]').forEach((element) => {
    const handler = () => {
      const { action, value, key } = element.dataset;
      if (action === 'color') store.setColor(value);
      if (action === 'slot') store.setSlot(key, value);
      if (action === 'psu-style') store.setPsuStyle(value);
      if (action === 'psu-position') store.setPsuPosition(value);
      if (action === 'accessory') store.setAccessory(value, element.checked);
    };
    element.addEventListener(element.type === 'checkbox' ? 'change' : 'click', handler);
  });
}
