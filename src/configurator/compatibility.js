function candidateWith(configuration, change) {
  return {
    ...configuration,
    slots: { ...configuration.slots, ...(change.slots ?? {}) },
    psuShroud: { ...configuration.psuShroud, ...(change.psuShroud ?? {}) },
    accessories: { ...configuration.accessories, ...(change.accessories ?? {}) },
  };
}

export function evaluateCompatibility(configuration) {
  const conflicts = [];

  if (configuration.slots.top === 'radiator-360' && configuration.accessories.handle) {
    conflicts.push('Le panneau radiateur 360 ne peut pas être utilisé avec la poignée.');
  }

  if (configuration.psuShroud.position === 'position-c' && configuration.accessories['gpu-support']) {
    conflicts.push('La position C du cache alimentation entre en conflit avec le support GPU.');
  }

  return { compatible: conflicts.length === 0, conflicts };
}

export function reasonForOption(configuration, change) {
  const result = evaluateCompatibility(candidateWith(configuration, change));
  return result.compatible ? '' : result.conflicts[0];
}
