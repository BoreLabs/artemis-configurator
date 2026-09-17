function baseChoices(configuration, bases) {
  return bases.map((base) => `
    <button class="choice ${configuration.base === base.id ? 'is-active' : ''}" type="button" data-action="base" data-value="${base.id}" aria-pressed="${configuration.base === base.id}">
      <span>${base.name}</span>
    </button>`).join('');
}

export function renderControls(root, configuration, catalog, store) {
  root.innerHTML = `
    <section class="control-group">
      <div class="group-heading"><span>01</span><h2>BASE</h2></div>
      <p class="control-label">Structure</p>
      <div class="choice-grid">${baseChoices(configuration, catalog.bases)}</div>
    </section>
    <section class="control-group">
      <div class="group-heading"><span>02</span><h2>COVER</h2></div>
      <label class="toggle cover-toggle">
        <input type="checkbox" data-action="cover" ${configuration.cover ? 'checked' : ''} />
        <span class="toggle-mark"></span><span>Afficher la cover</span>
      </label>
    </section>`;

  root.querySelectorAll('[data-action]').forEach((element) => {
    const handler = () => {
      if (element.dataset.action === 'base') store.setBase(element.dataset.value);
      if (element.dataset.action === 'cover') store.setCover(element.checked);
    };
    element.addEventListener(element.type === 'checkbox' ? 'change' : 'click', handler);
  });
}
