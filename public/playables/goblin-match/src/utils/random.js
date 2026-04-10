export const randomInt = (max) => Math.floor(Math.random() * max);

export const pickRandom = (items) => {
  if (!items.length) {
    return null;
  }

  return items[randomInt(items.length)];
};

export const shuffle = (items) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};
