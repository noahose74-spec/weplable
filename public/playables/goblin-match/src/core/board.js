import { TUNING } from "../config/tuning.js";
import { COLORS, TILE_KIND } from "../config/constants.js";
import { isWithinBounds, forEachCell } from "../utils/grid.js";
import { pickRandom, shuffle } from "../utils/random.js";

let tileId = 0;

const createBlock = (color) => ({
  id: `tile-${tileId += 1}`,
  kind: TILE_KIND.BLOCK,
  color,
  special: null,
});

const pickWeightedColor = (leaderColor) => {
  const weights = COLORS.map((color) => ({
    color,
    weight: color === leaderColor ? 1.5 : 1,
  }));
  const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;

  for (const entry of weights) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.color;
    }
  }

  return COLORS[0];
};

export const createObstacle = () => ({
  id: `tile-${tileId += 1}`,
  kind: TILE_KIND.OBSTACLE,
  color: null,
  special: null,
  health: 1,
});

export const createGoalItem = () => ({
  id: `tile-${tileId += 1}`,
  kind: TILE_KIND.GOAL_ITEM,
  color: null,
  special: null,
  health: 1,
});

export const cloneTile = (tile) => {
  if (!tile) {
    return null;
  }

  return {
    ...tile,
    special: tile.special ? { ...tile.special } : null,
  };
};

export const createEmptyBoard = (width, height) =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => null));

const causesMatchAt = (board, x, y, color) => {
  const lines = [
    [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ],
    [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ],
  ];

  const countDirection = (stepX, stepY) => {
    let count = 0;
    let nextX = x + stepX;
    let nextY = y + stepY;

    while (board[nextY]?.[nextX]?.kind === TILE_KIND.BLOCK && board[nextY][nextX].color === color) {
      count += 1;
      nextX += stepX;
      nextY += stepY;
    }

    return count;
  };

  return lines.some(([negative, positive]) => {
    const total =
      1 +
      countDirection(negative.x, negative.y) +
      countDirection(positive.x, positive.y);
    return total >= 3;
  }) || (
    board[y - 1]?.[x]?.kind === TILE_KIND.BLOCK &&
    board[y]?.[x - 1]?.kind === TILE_KIND.BLOCK &&
    board[y - 1]?.[x - 1]?.kind === TILE_KIND.BLOCK &&
    board[y - 1][x].color === color &&
    board[y][x - 1].color === color &&
    board[y - 1][x - 1].color === color
  ) || (
    board[y - 1]?.[x]?.kind === TILE_KIND.BLOCK &&
    board[y]?.[x + 1]?.kind === TILE_KIND.BLOCK &&
    board[y - 1]?.[x + 1]?.kind === TILE_KIND.BLOCK &&
    board[y - 1][x].color === color &&
    board[y][x + 1].color === color &&
    board[y - 1][x + 1].color === color
  );
};

export const getTile = (board, x, y) => board[y]?.[x] ?? null;

export const setTile = (board, x, y, tile) => {
  board[y][x] = tile;
};

export const isWalkableTile = (tile) => tile?.kind === TILE_KIND.BLOCK;

export const isWalkableCell = (board, x, y) => isWalkableTile(getTile(board, x, y));

export const swapTiles = (board, start, end) => {
  const first = getTile(board, start.x, start.y);
  const second = getTile(board, end.x, end.y);
  setTile(board, start.x, start.y, second);
  setTile(board, end.x, end.y, first);
};

const pickReservedCells = (width, height, obstacleCount, goalItemCount, leaderStart) => {
  const cells = [];

  forEachCell(width, height, (x, y) => {
    if ((x === 0 || x === width - 1) && (y === 0 || y === height - 1)) {
      return;
    }

    if (leaderStart && Math.abs(x - leaderStart.x) <= 1 && Math.abs(y - leaderStart.y) <= 1) {
      return;
    }

    cells.push({ x, y });
  });

  const shuffled = shuffle(cells);
  const obstacleCells = shuffled.slice(0, obstacleCount);
  const obstacleLookup = new Set(obstacleCells.map((cell) => `${cell.x},${cell.y}`));
  const remaining = cells.filter((cell) => !obstacleLookup.has(`${cell.x},${cell.y}`));
  const goalItemCells = [];

  const isFarEnough = (candidate) =>
    goalItemCells.every((cell) => Math.abs(cell.x - candidate.x) + Math.abs(cell.y - candidate.y) >= 5);

  const center = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  };
  remaining.sort((a, b) => {
    const distanceA = Math.abs(a.x - center.x) + Math.abs(a.y - center.y);
    const distanceB = Math.abs(b.x - center.x) + Math.abs(b.y - center.y);
    return distanceA - distanceB;
  });

  remaining.forEach((candidate) => {
    if (goalItemCells.length >= goalItemCount) {
      return;
    }

    if (isFarEnough(candidate)) {
      goalItemCells.push(candidate);
    }
  });

  remaining.forEach((candidate) => {
    if (goalItemCells.length >= goalItemCount) {
      return;
    }

    if (!goalItemCells.some((cell) => cell.x === candidate.x && cell.y === candidate.y)) {
      goalItemCells.push(candidate);
    }
  });

  return {
    obstacleCells,
    goalItemCells,
  };
};

export const createBoard = (stage, leaderColor = null) => {
  const board = createEmptyBoard(stage.width, stage.height);
  const { obstacleCells, goalItemCells } = pickReservedCells(
    stage.width,
    stage.height,
    stage.obstacleCount,
    stage.goalItemCount ?? 0,
    stage.leaderStart,
  );
  const obstacleLookup = new Set(obstacleCells.map(({ x, y }) => `${x},${y}`));
  const goalItemLookup = new Set(goalItemCells.map(({ x, y }) => `${x},${y}`));

  forEachCell(stage.width, stage.height, (x, y) => {
    if (obstacleLookup.has(`${x},${y}`)) {
      board[y][x] = createObstacle();
      return;
    }

    if (goalItemLookup.has(`${x},${y}`)) {
      board[y][x] = createGoalItem();
      return;
    }

    const availableColors = COLORS.filter((color) => !causesMatchAt(board, x, y, color));
    if (availableColors.length) {
      if (!leaderColor) {
        board[y][x] = createBlock(pickRandom(availableColors));
      } else {
        const weightedPool = [];
        for (let index = 0; index < 12; index += 1) {
          const picked = pickWeightedColor(leaderColor);
          if (availableColors.includes(picked)) {
            weightedPool.push(picked);
          }
        }
        board[y][x] = createBlock(pickRandom(weightedPool.length ? weightedPool : availableColors));
      }
    } else {
      board[y][x] = createBlock(leaderColor ? pickWeightedColor(leaderColor) : pickRandom(COLORS));
    }
  });

  return board;
};

export const findLeaderStart = (board, width, height, preferred = null) => {
  const preferredPoint = preferred ?? {
    x: Math.floor(width / 2),
    y: height - 2,
  };

  if (isWalkableCell(board, preferredPoint.x, preferredPoint.y)) {
    return preferredPoint;
  }

  for (let radius = 1; radius < Math.max(width, height); radius += 1) {
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
        const x = preferredPoint.x + offsetX;
        const y = preferredPoint.y + offsetY;
        if (isWithinBounds(width, height, x, y) && isWalkableCell(board, x, y)) {
          return { x, y };
        }
      }
    }
  }

  return { x: 0, y: 0 };
};

export const cloneBoard = (board) => board.map((row) => row.map((tile) => cloneTile(tile)));

export const createRefillTile = (board, x, y) => {
  const safeColors = TUNING.tileColors.filter((color) => !causesMatchAt(board, x, y, color));
  return createBlock(pickRandom(safeColors.length ? safeColors : TUNING.tileColors));
};

export const refillMissingBlocks = (board) => {
  forEachCell(board[0].length, board.length, (x, y) => {
    if (!getTile(board, x, y)) {
      setTile(board, x, y, createRefillTile(board, x, y));
    }
  });

  return board;
};

export const countObstacles = (board) => {
  let count = 0;
  forEachCell(board[0].length, board.length, (x, y) => {
    if (getTile(board, x, y)?.kind === TILE_KIND.OBSTACLE) {
      count += 1;
    }
  });
  return count;
};

export const countGoalItems = (board) => {
  let count = 0;
  forEachCell(board[0].length, board.length, (x, y) => {
    if (getTile(board, x, y)?.kind === TILE_KIND.GOAL_ITEM) {
      count += 1;
    }
  });
  return count;
};
