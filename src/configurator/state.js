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
    setBase(base) {
      if (state.base === base) return;
      state.base = base;
      publish();
    },
    setCover(visible) {
      if (state.cover === visible) return;
      state.cover = visible;
      publish();
    },
    reset() {
      state = copy(defaultState);
      publish();
    },
  };
}
