export const toKey = (x, y) => `${x},${y}`;

export const fromKey = (key) => {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
};

export const isWithinBounds = (width, height, x, y) =>
  x >= 0 && y >= 0 && x < width && y < height;

export const forEachCell = (width, height, callback) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      callback(x, y);
    }
  }
};

export const getNeighbors8 = (width, height, x, y, directions) =>
  directions
    .map((direction) => ({ x: x + direction.x, y: y + direction.y }))
    .filter((point) => isWithinBounds(width, height, point.x, point.y));

export const uniquePoints = (points) => {
  const seen = new Set();
  return points.filter((point) => {
    const key = toKey(point.x, point.y);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
