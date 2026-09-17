function baseChoices(configuration, bases) {
  return bases.map((base) => `
    <button class="choice ${configuration.base === base.id ? 'is-active' : ''}" type="button" data-action="base" data-value="${base.id}" aria-pressed="${configuration.base === base.id}">
      <span>${base.name}</span>
    </button>`).join('');
}

function colorChoices(colors, selectedColor, part) {
  return colors.map((color) => `
    <button class="color-choice ${selectedColor === color.id ? 'is-active' : ''}" type="button" data-action="color" data-part="${part}" data-value="${color.id}" aria-label="${color.name}" aria-pressed="${selectedColor === color.id}">
      <span style="--swatch:${color.value}"></span><b>${color.name}</b>
    </button>`).join('');
}

export function renderControls(root, configuration, catalog, store) {
  root.innerHTML = `
    <section class="control-group">
      <div class="group-heading"><span>01</span><h2>BASE</h2></div>
      <p class="control-label">Structure</p>
      <div class="choice-grid">${baseChoices(configuration, catalog.bases)}</div>
      <p class="control-label">Couleur</p>
      <div class="color-grid">${colorChoices(catalog.colors, configuration.colors.base, 'base')}</div>
    </section>
    <section class="control-group">
      <div class="group-heading"><span>02</span><h2>COVER</h2></div>
      <p class="control-label">Couleur</p>
      <div class="color-grid">${colorChoices(catalog.colors, configuration.colors.cover, 'cover')}</div>
      <label class="toggle cover-toggle">
        <input type="checkbox" data-action="cover" ${configuration.cover ? 'checked' : ''} />
        <span class="toggle-mark"></span><span>Afficher la cover</span>
      </label>
    </section>`;

  root.querySelectorAll('[data-action]').forEach((element) => {
    const handler = () => {
      if (element.dataset.action === 'base') store.setBase(element.dataset.value);
      if (element.dataset.action === 'cover') store.setCover(element.checked);
      if (element.dataset.action === 'color') store.setColor(element.dataset.part, element.dataset.value);
    };
    element.addEventListener(element.type === 'checkbox' ? 'change' : 'click', handler);
  });
}
