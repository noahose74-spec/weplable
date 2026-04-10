import { TILE_KIND } from "../config/constants.js";
import { toKey, fromKey, uniquePoints } from "../utils/grid.js";

const getMatchTile = (board, x, y, context) => {
  const tile = board[y][x];

  if (!tile || tile.kind !== TILE_KIND.BLOCK) {
    return null;
  }

  if (tile.special) {
    return null;
  }

  if (context?.leaderPosition?.x === x && context?.leaderPosition?.y === y) {
    return {
      kind: TILE_KIND.BLOCK,
      color: context.leaderColor,
      countedAsLeader: true,
    };
  }

  return tile;
};

const appendRun = (matches, run, orientation) => {
  if (run.length < 3) {
    return null;
  }

  const color = run[0].tile.color;
  const points = run.map(({ x, y }) => ({ x, y }));
  const includesLeader = run.some(({ tile }) => tile.countedAsLeader);
  points.forEach(({ x, y }) => matches.add(toKey(x, y)));

  return {
    color,
    cells: points,
    orientation,
    includesLeader,
  };
};

export const findMatches = (board, context = null) => {
  const width = board[0].length;
  const height = board.length;
  const groups = [];
  const matched = new Set();
  const horizontalGroups = [];
  const verticalGroups = [];
  const squareGroups = [];

  for (let y = 0; y < height; y += 1) {
    let run = [];

    for (let x = 0; x < width; x += 1) {
      const tile = getMatchTile(board, x, y, context);
      const last = run.at(-1)?.tile;

      if (tile?.kind === TILE_KIND.BLOCK && (!last || last.color === tile.color)) {
        run.push({ x, y, tile });
      } else {
        const group = appendRun(matched, run, "horizontal");
        if (group) {
          horizontalGroups.push(group);
        }
        run = tile?.kind === TILE_KIND.BLOCK ? [{ x, y, tile }] : [];
      }
    }

    const group = appendRun(matched, run, "horizontal");
    if (group) {
      horizontalGroups.push(group);
    }
  }

  for (let x = 0; x < width; x += 1) {
    let run = [];

    for (let y = 0; y < height; y += 1) {
      const tile = getMatchTile(board, x, y, context);
      const last = run.at(-1)?.tile;

      if (tile?.kind === TILE_KIND.BLOCK && (!last || last.color === tile.color)) {
        run.push({ x, y, tile });
      } else {
        const group = appendRun(matched, run, "vertical");
        if (group) {
          verticalGroups.push(group);
        }
        run = tile?.kind === TILE_KIND.BLOCK ? [{ x, y, tile }] : [];
      }
    }

    const group = appendRun(matched, run, "vertical");
    if (group) {
      verticalGroups.push(group);
    }
  }

  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const topLeft = getMatchTile(board, x, y, context);
      const topRight = getMatchTile(board, x + 1, y, context);
      const bottomLeft = getMatchTile(board, x, y + 1, context);
      const bottomRight = getMatchTile(board, x + 1, y + 1, context);

      if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
        continue;
      }

      const color = topLeft.color;
      if (
        topRight.color === color &&
        bottomLeft.color === color &&
        bottomRight.color === color
      ) {
        const cells = [
          { x, y },
          { x: x + 1, y },
          { x, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ];
        const includesLeader = [topLeft, topRight, bottomLeft, bottomRight].some(
          (tile) => tile.countedAsLeader,
        );
        cells.forEach((cell) => matched.add(toKey(cell.x, cell.y)));
        squareGroups.push({
          color,
          cells,
          orientation: "square",
          includesLeader,
        });
      }
    }
  }

  const lookup = new Map();

  [...horizontalGroups, ...verticalGroups, ...squareGroups].forEach((group) => {
    group.cells.forEach((cell) => {
      const key = toKey(cell.x, cell.y);
      if (!lookup.has(key)) {
        lookup.set(key, []);
      }
      lookup.get(key).push(group);
    });
  });

  const visited = new Set();

  [...horizontalGroups, ...verticalGroups, ...squareGroups].forEach((group) => {
    const startingKey = toKey(group.cells[0].x, group.cells[0].y);
    if (visited.has(startingKey)) {
      return;
    }

    const queue = [...group.cells];
    const combined = [];
    const memberGroups = new Set();
    const color = group.color;

    while (queue.length) {
      const cell = queue.pop();
      const key = toKey(cell.x, cell.y);
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      combined.push(cell);

      const relatedGroups = (lookup.get(key) ?? []).filter((entry) => entry.color === color);
      relatedGroups.forEach((entry) => {
        memberGroups.add(entry);
        entry.cells.forEach((entryCell) => {
          const entryKey = toKey(entryCell.x, entryCell.y);
          if (!visited.has(entryKey)) {
            queue.push(entryCell);
          }
        });
      });
    }

    groups.push({
      color,
      cells: uniquePoints(combined),
      horizontal: [...memberGroups].some((entry) => entry.orientation === "horizontal"),
      vertical: [...memberGroups].some((entry) => entry.orientation === "vertical"),
      diagonal: false,
      lineLengths: [...memberGroups]
        .filter((entry) => entry.orientation !== "square")
        .map((entry) => entry.cells.length),
      isIntersecting:
        [...memberGroups].filter((entry) => entry.orientation !== "square").length > 1,
      includesLeader: [...memberGroups].some((entry) => entry.includesLeader),
      hasSquare: [...memberGroups].some((entry) => entry.orientation === "square"),
    });
  });

  return {
    groups,
    matchedCells: [...matched].map(fromKey),
  };
};
