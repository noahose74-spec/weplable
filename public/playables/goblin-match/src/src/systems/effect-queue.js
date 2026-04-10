export const createEffectQueue = () => ({
  messages: [],
});

export const pushEffects = (queue, messages) => {
  queue.messages.unshift(...messages);
  queue.messages = queue.messages.slice(0, 8);
  return queue;
};
