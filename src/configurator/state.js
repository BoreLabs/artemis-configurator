const copy = (value) => structuredClone(value);

export function createConfiguratorStore(defaultState) {
  let state = copy(defaultState);
  const subscribers = new Set();

  function publish() {
    const snapshot = copy(state);
    subscribers.forEach((subscriber) => subscriber(snapshot));
  }

  return {
    getState: () => copy(state),
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    setColor(color) {
      state.color = color;
      publish();
    },
    setSlot(slot, option) {
      state.slots[slot] = option;
      publish();
    },
    setPsuStyle(style) {
      state.psuShroud.style = style;
      publish();
    },
    setPsuPosition(position) {
      state.psuShroud.position = position;
      publish();
    },
    setAccessory(accessory, enabled) {
      state.accessories[accessory] = enabled;
      publish();
    },
    reset() {
      state = copy(defaultState);
      publish();
    },
  };
}
