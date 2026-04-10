import { TUNING } from "../config/tuning.js";
import { SPECIAL_TYPES, TILE_KIND } from "../config/constants.js";
import { getTile, setTile, createRefillTile } from "./board.js";
import { findMatches } from "./match-finder.js";
import { getSpecialForGroup, pickSpecialAnchor } from "./specials.js";
import { uniquePoints, toKey } from "../utils/grid.js";
import { pickRandom, shuffle } from "../utils/random.js";

const addPoints = (set, points) => {
  points.forEach((point) => set.add(toKey(point.x, point.y)));
};

const normalizePoints = (set) =>
  [...set].map((key) => {
    const [x, y] = key.split(",").map(Number);
    return { x, y };
  });

const getBoundingCenter = (cells) => {
  const total = cells.reduce(
    (sum, cell) => ({
      x: sum.x + cell.x,
      y: sum.y + cell.y,
    }),
    { x: 0, y: 0 },
  );

  return {
    x: Math.round(total.x / cells.length),
    y: Math.round(total.y / cells.length),
  };
};

const isDirectlyClearableTile = (tile, { includeObstacles = true } = {}) => {
  if (!tile) {
    return false;
  }

  if (tile.kind === TILE_KIND.GOAL_ITEM) {
    return false;
  }

  if (!includeObstacles && tile.kind === TILE_KIND.OBSTACLE) {
    return false;
  }

  return true;
};

const collectArea = (board, center, radius, includeObstacles = true) => {
  const points = [];

  for (let y = center.y - radius; y <= center.y + radius; y += 1) {
    for (let x = center.x - radius; x <= center.x + radius; x += 1) {
      const tile = getTile(board, x, y);
      if (!isDirectlyClearableTile(tile, { includeObstacles })) {
        continue;
      }

      points.push({ x, y });
    }
  }

  return points;
};

const collectRow = (board, rowIndex) =>
  board[rowIndex].flatMap((tile, x) => (isDirectlyClearableTile(tile) ? [{ x, y: rowIndex }] : []));

const collectColumn = (board, columnIndex) =>
  board.flatMap((row, y) => (isDirectlyClearableTile(row[columnIndex]) ? [{ x: columnIndex, y }] : []));

const collectAllBlocks = (board) =>
  board.flatMap((row, y) =>
    row.flatMap((tile, x) => (tile?.kind === TILE_KIND.BLOCK ? [{ x, y }] : [])),
  );

const collectMostCommonBlockColor = (board) => {
  const counts = board.flat().reduce((lookup, tile) => {
    if (tile?.kind !== TILE_KIND.BLOCK || tile.special) {
      return lookup;
    }

    lookup.set(tile.color, (lookup.get(tile.color) ?? 0) + 1);
    return lookup;
  }, new Map());

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

const collectCross = (board, center, radius) => {
  const points = new Map();

  for (let offset = -radius; offset <= radius; offset += 1) {
    const rowTile = getTile(board, center.x + offset, center.y);
    if (isDirectlyClearableTile(rowTile)) {
      points.set(toKey(center.x + offset, center.y), { x: center.x + offset, y: center.y });
    }

    const columnTile = getTile(board, center.x, center.y + offset);
    if (isDirectlyClearableTile(columnTile)) {
      points.set(toKey(center.x, center.y + offset), { x: center.x, y: center.y + offset });
    }
  }

  return [...points.values()];
};

const createResolutionStep = (board, points, effectEvents, extra = {}) => {
  const unique = uniquePoints(points);
  const goalItemPoints = collectNearbyGoalItems(board, unique);
  const allPoints = uniquePoints([...unique, ...goalItemPoints]);
  const summary = clearPoints(board, allPoints);
  const falls = applyGravity(board);

  return {
    summary,
    step: {
      cascade: 0,
      cleared: allPoints,
      effectEvents,
      specialSpawns: [],
      falls,
      goblinMatch: false,
      goblinMatchCells: [],
      ...extra,
    },
  };
};

export const resolveSwapSpecialActivation = (board, startPoint, startTile, endPoint, endTile) => {
  const pointsToClear = new Set();
  const effectEvents = [];
  const add = (points) => addPoints(pointsToClear, points);

  const applySingleSpecial = (point, tile, otherTile) => {
    if (tile.special.type === SPECIAL_TYPES.LINE_ROW) {
      add(collectRow(board, point.y));
      effectEvents.push("Rocket cleared a row");
    } else if (tile.special.type === SPECIAL_TYPES.LINE_COLUMN) {
      add(collectColumn(board, point.x));
      effectEvents.push("Rocket cleared a column");
    } else if (tile.special.type === SPECIAL_TYPES.BOMB) {
      add(collectArea(board, point, 2));
      effectEvents.push("TNT exploded");
    } else if (tile.special.type === SPECIAL_TYPES.RAINBOW) {
      const targetColor =
        otherTile?.kind === TILE_KIND.BLOCK ? otherTile.color : collectMostCommonBlockColor(board);
      if (targetColor) {
        add(collectTilesByColor(board, targetColor));
        effectEvents.push(`Light Ball cleared all ${targetColor} blocks`);
      }
    }
  };

  if (!startTile?.special && !endTile?.special) {
    return null;
  }

  if (startTile?.special && endTile?.special) {
    add([startPoint, endPoint]);
    const specials = [startTile.special.type, endTile.special.type].sort().join("+");

    if (
      startTile.special.type === SPECIAL_TYPES.LINE_ROW ||
      startTile.special.type === SPECIAL_TYPES.LINE_COLUMN ||
      endTile.special.type === SPECIAL_TYPES.LINE_ROW ||
      endTile.special.type === SPECIAL_TYPES.LINE_COLUMN
    ) {
      if (
        (startTile.special.type === SPECIAL_TYPES.LINE_ROW || startTile.special.type === SPECIAL_TYPES.LINE_COLUMN) &&
        (endTile.special.type === SPECIAL_TYPES.LINE_ROW || endTile.special.type === SPECIAL_TYPES.LINE_COLUMN)
      ) {
        add(collectRow(board, startPoint.y));
        add(collectColumn(board, startPoint.x));
        add(collectRow(board, endPoint.y));
        add(collectColumn(board, endPoint.x));
        effectEvents.push("Rocket + Rocket cleared both rows and columns");
      } else if (
        startTile.special.type === SPECIAL_TYPES.BOMB ||
        endTile.special.type === SPECIAL_TYPES.BOMB
      ) {
        for (let row = endPoint.y - 1; row <= endPoint.y + 1; row += 1) {
          if (board[row]) {
            add(collectRow(board, row));
          }
        }
        for (let column = endPoint.x - 1; column <= endPoint.x + 1; column += 1) {
          if (board[0][column] !== undefined) {
            add(collectColumn(board, column));
          }
        }
        effectEvents.push("Rocket + TNT cleared three rows and three columns");
      }
    }

    if (specials.includes(SPECIAL_TYPES.RAINBOW)) {
      const otherSpecial =
        startTile.special.type === SPECIAL_TYPES.RAINBOW ? endTile.special.type : startTile.special.type;

      if (otherSpecial === SPECIAL_TYPES.RAINBOW) {
        add(collectAllBlocks(board));
        effectEvents.push("Light Ball + Light Ball cleared the board");
      } else {
        const targetColor = collectMostCommonBlockColor(board);
        if (targetColor) {
          add(collectTilesByColor(board, targetColor));
          effectEvents.push(`Light Ball empowered ${targetColor} blocks into a chain reaction`);
        }
      }
    } else if (
      startTile.special.type === SPECIAL_TYPES.BOMB &&
      endTile.special.type === SPECIAL_TYPES.BOMB
    ) {
      add(collectArea(board, endPoint, 4));
      effectEvents.push("TNT + TNT exploded in a huge area");
    }
  } else if (endTile?.special) {
    add([endPoint]);
    applySingleSpecial(endPoint, endTile, startTile);
  } else if (startTile?.special) {
    add([startPoint]);
    applySingleSpecial(startPoint, startTile, endTile);
  }

  const unique = normalizePoints(pointsToClear);
  if (!unique.length) {
    return null;
  }

  return createResolutionStep(board, unique, effectEvents, {
    activatedBySwap: true,
  });
};

const collectNearbyGoalItems = (board, clearedPoints) => {
  const goalPoints = new Set();

  clearedPoints.forEach((point) => {
    [
      point,
      { x: point.x - 1, y: point.y },
      { x: point.x + 1, y: point.y },
      { x: point.x, y: point.y - 1 },
      { x: point.x, y: point.y + 1 },
    ].forEach(({ x, y }) => {
      const tile = getTile(board, x, y);
      if (tile?.kind === TILE_KIND.GOAL_ITEM) {
        goalPoints.add(toKey(x, y));
      }
    });
  });

  return normalizePoints(goalPoints);
};

const triggerSpecial = (board, point, pointsToClear, effectEvents) => {
  const tile = getTile(board, point.x, point.y);
  if (!tile?.special) {
    return;
  }

  const specialType = tile.special.type;

  if (specialType === SPECIAL_TYPES.LINE_ROW) {
    addPoints(
      pointsToClear,
      board[point.y]
        .flatMap((tile, x) => (isDirectlyClearableTile(tile) ? [{ x, y: point.y }] : [])),
    );
    effectEvents.push(`Line block cleared row ${point.y + 1}`);
  } else if (specialType === SPECIAL_TYPES.LINE_COLUMN) {
    addPoints(
      pointsToClear,
      board.flatMap((row, y) =>
        isDirectlyClearableTile(row[point.x]) ? [{ x: point.x, y }] : [],
      ),
    );
    effectEvents.push(`Line block cleared column ${point.x + 1}`);
  } else if (specialType === SPECIAL_TYPES.BOMB) {
    addPoints(pointsToClear, collectArea(board, point, 2));
    effectEvents.push("TNT exploded");
  } else if (specialType === SPECIAL_TYPES.RAINBOW) {
    const targetColors = board
      .flat()
      .filter((entry) => entry?.kind === TILE_KIND.BLOCK && !entry.special)
      .map((entry) => entry.color);
    const targetColor = pickRandom(targetColors);
    if (targetColor) {
      addPoints(
        pointsToClear,
        board.flatMap((row, y) =>
          row.flatMap((entry, x) =>
            entry?.kind === TILE_KIND.BLOCK && entry.color === targetColor ? [{ x, y }] : [],
          ),
        ),
      );
      effectEvents.push(`Light Ball cleared ${targetColor} tiles`);
    }
  }
};

const applyLeaderEffect = (
  board,
  leaderColor,
  group,
  pointsToClear,
  effectEvents,
  { isGoblinMatch = false, isBuffed = false } = {},
) => {
  if (group.color !== leaderColor) {
    return;
  }

  const center = getBoundingCenter(group.cells);
  const boosted = isGoblinMatch || isBuffed;

  if (leaderColor === "red") {
    const radius = TUNING.leaderAreaRadius + (boosted ? TUNING.redLeaderRadiusPerTier : 0);
    addPoints(pointsToClear, collectArea(board, center, radius));
    effectEvents.push(isGoblinMatch ? "Red goblin burst detonated" : boosted ? "Red buff burst triggered" : "Red leader burst triggered");
  } else if (leaderColor === "blue") {
    if (!boosted) {
      const clearRow = Math.random() > 0.5;
      if (clearRow) {
        addPoints(pointsToClear, collectRow(board, center.y));
        effectEvents.push("Blue leader cleared an extra row");
      } else {
        addPoints(pointsToClear, collectColumn(board, center.x));
        effectEvents.push("Blue leader cleared an extra column");
      }
    } else {
      addPoints(pointsToClear, collectRow(board, center.y));
      addPoints(pointsToClear, collectColumn(board, center.x));
      effectEvents.push(isGoblinMatch ? "Goblin Match widened the blue line clear" : "Blue buff added a cross clear");
    }
  } else if (leaderColor === "green") {
    const obstaclePoints = collectCross(
      board,
      center,
      1 + (boosted ? TUNING.greenLeaderRangePerTier : 0),
    ).filter((point) => {
      const tile = getTile(board, point.x, point.y);
      return tile?.kind === TILE_KIND.OBSTACLE || tile?.kind === TILE_KIND.GOAL_ITEM;
    });
    addPoints(pointsToClear, obstaclePoints);
    effectEvents.push(group.includesLeader ? "Goblin Match smashed nearby objectives" : "Green leader damaged nearby crates");
  } else if (leaderColor === "yellow") {
    const yellowCells = shuffle(
      board.flatMap((row, y) =>
        row.flatMap((tile, x) =>
          tile?.kind === TILE_KIND.BLOCK && tile.color === "yellow" ? [{ x, y }] : [],
        ),
      ),
    ).slice(0, TUNING.yellowLeaderBonusCount + (boosted ? TUNING.yellowLeaderBonusPerTier : 0));
    addPoints(pointsToClear, yellowCells);
    effectEvents.push(group.includesLeader ? "Goblin Match unleashed extra yellow clears" : "Yellow leader removed bonus yellow blocks");
  }
};

const clearPoints = (board, points) => {
  const result = {
    obstaclesCleared: 0,
    blocksCleared: 0,
    goalItemsCleared: 0,
  };

  points.forEach((point) => {
    const tile = getTile(board, point.x, point.y);
    if (!tile) {
      return;
    }

    if (tile.kind === TILE_KIND.OBSTACLE) {
      result.obstaclesCleared += 1;
    } else if (tile.kind === TILE_KIND.GOAL_ITEM) {
      result.goalItemsCleared += 1;
    } else if (tile.kind === TILE_KIND.BLOCK) {
      result.blocksCleared += 1;
    }

    setTile(board, point.x, point.y, null);
  });

  return result;
};

const applyGravity = (board) => {
  const width = board[0].length;
  const height = board.length;
  const falls = [];

  for (let x = 0; x < width; x += 1) {
    const settled = [];

    for (let y = height - 1; y >= 0; y -= 1) {
      const tile = getTile(board, x, y);
      if (!tile || tile.kind === TILE_KIND.OBSTACLE || tile.kind === TILE_KIND.GOAL_ITEM) {
        continue;
      }
      settled.push({ tile, fromY: y });
    }

    for (let y = height - 1; y >= 0; y -= 1) {
      const current = getTile(board, x, y);

      if (current?.kind === TILE_KIND.OBSTACLE || current?.kind === TILE_KIND.GOAL_ITEM) {
        continue;
      }

      const next = settled.shift();
      if (next) {
        setTile(board, x, y, next.tile);
        if (next.fromY !== y) {
          falls.push({
            tileId: next.tile.id,
            x,
            fromY: next.fromY,
            toY: y,
            distance: y - next.fromY,
            spawned: false,
          });
        }
      } else {
        const refillTile = createRefillTile(board, x, y);
        setTile(board, x, y, refillTile);
        falls.push({
          tileId: refillTile.id,
          x,
          fromY: -1,
          toY: y,
          distance: y + 1,
          spawned: true,
        });
      }
    }
  }

  return falls;
};

export const resolveBoard = (board, context) => {
  const timeline = [];
  const totals = {
    obstaclesCleared: 0,
    blocksCleared: 0,
    goalItemsCleared: 0,
    targetColorCleared: 0,
    leaderMatches: 0,
    goblinMatches: 0,
  };

  let cascade = 0;
  let wasTruncated = false;

  while (cascade < TUNING.maxCascadeSteps) {
    const matches = findMatches(board, context);
    if (!matches.matchedCells.length) {
      break;
    }

    cascade += 1;
    const pointsToClear = new Set();
    const effectEvents = [];
    const specialSpawns = [];

    addPoints(pointsToClear, matches.matchedCells);

    matches.groups.forEach((group) => {
      if (group.color === context.leader.color) {
        totals.leaderMatches += 1;
      }

      if (group.includesLeader) {
        totals.goblinMatches += 1;
        effectEvents.push("Goblin Match!");
      }

      const special = getSpecialForGroup(group);
      if (special) {
        const anchor = pickSpecialAnchor(group, context.lastMoveTarget);
        pointsToClear.delete(toKey(anchor.x, anchor.y));
        specialSpawns.push({
          point: anchor,
          special,
          color: group.color,
        });
      }

      applyLeaderEffect(board, context.leader.color, group, pointsToClear, effectEvents, {
        isGoblinMatch: group.includesLeader,
        isBuffed: context.buffTurnsActive > 0,
      });
    });

    normalizePoints(pointsToClear).forEach((point) =>
      triggerSpecial(board, point, pointsToClear, effectEvents),
    );

    specialSpawns.forEach((spawn) => {
      const tile = getTile(board, spawn.point.x, spawn.point.y);
      if (tile?.kind === TILE_KIND.BLOCK) {
        tile.special = spawn.special;
      }
    });

    const goalItemPoints = collectNearbyGoalItems(board, matches.matchedCells);
    addPoints(pointsToClear, goalItemPoints);

    const clearSummary = clearPoints(board, uniquePoints(normalizePoints(pointsToClear)));
    totals.obstaclesCleared += clearSummary.obstaclesCleared;
    totals.blocksCleared += clearSummary.blocksCleared;
    totals.goalItemsCleared += clearSummary.goalItemsCleared;

    matches.groups.forEach((group) => {
      if (group.color === context.goalTargetColor) {
        totals.targetColorCleared += group.cells.length;
      }
    });

    const falls = applyGravity(board);

    timeline.push({
      cascade,
      cleared: normalizePoints(pointsToClear),
      effectEvents,
      specialSpawns,
      falls,
      goblinMatch: matches.groups.some((group) => group.includesLeader),
      goblinMatchCells: uniquePoints(
        matches.groups
          .filter((group) => group.includesLeader)
          .flatMap((group) => group.cells),
      ),
    });
  }

  if (cascade >= TUNING.maxCascadeSteps) {
    const remainingMatches = findMatches(board, context);
    wasTruncated = Boolean(remainingMatches.matchedCells.length);
  }

  if (wasTruncated) {
    timeline.push({
      cascade: TUNING.maxCascadeSteps,
      cleared: [],
      effectEvents: ["Cascade limit reached. Board stabilized early."],
      specialSpawns: [],
      falls: [],
    });
  }

  return {
    board,
    timeline,
    ...totals,
  };
};

const collectTilesByColor = (board, color) =>
  board.flatMap((row, y) =>
    row.flatMap((tile, x) =>
      tile?.kind === TILE_KIND.BLOCK && tile.color === color ? [{ x, y }] : [],
    ),
  );

export const applyItemEffect = (board, itemId, target) => {
  const pointsToClear = new Set();
  const effectEvents = [];

  if (itemId === "red" && target) {
    addPoints(pointsToClear, collectArea(board, target, TUNING.redItemRadius));
    effectEvents.push("Red item exploded a 3x3 area");
  } else if (itemId === "blue" && target) {
    for (let offset = 0; offset < TUNING.blueItemLineSpan; offset += 1) {
      const row = Math.min(board.length - 1, target.y + offset);
      addPoints(
        pointsToClear,
        board[row].flatMap((tile, x) => (isDirectlyClearableTile(tile) ? [{ x, y: row }] : [])),
      );
    }
    effectEvents.push("Blue item cleared two rows");
  } else if (itemId === "green") {
    const nearbyObstacles = target
      ? shuffle(
          collectArea(board, target, 2).filter(
            (point) => getTile(board, point.x, point.y)?.kind === TILE_KIND.OBSTACLE,
          ),
        )
      : [];
    const obstacles = (nearbyObstacles.length ? nearbyObstacles : shuffle(
      board.flatMap((row, y) =>
        row.flatMap((tile, x) => (tile?.kind === TILE_KIND.OBSTACLE ? [{ x, y }] : [])),
      ),
    )).slice(0, TUNING.greenItemObstacleClearCount);
    addPoints(pointsToClear, obstacles);
    effectEvents.push("Green item broke several crates");
  } else if (itemId === "yellow") {
    const clickedTile =
      target?.x !== undefined && target?.y !== undefined ? getTile(board, target.x, target.y) : null;
    const color = target?.color ?? (clickedTile?.kind === TILE_KIND.BLOCK ? clickedTile.color : null);
    if (color) {
      addPoints(pointsToClear, collectTilesByColor(board, color));
      effectEvents.push(`Yellow item removed all ${color} blocks`);
    }
  }

  normalizePoints(pointsToClear).forEach((point) =>
    triggerSpecial(board, point, pointsToClear, effectEvents),
  );

  const goalItemPoints = collectNearbyGoalItems(board, normalizePoints(pointsToClear));
  addPoints(pointsToClear, goalItemPoints);

  const summary = clearPoints(board, uniquePoints(normalizePoints(pointsToClear)));
  const falls = applyGravity(board);

  return {
    board,
    ...summary,
    targetColorCleared: 0,
    effectEvents,
    falls,
  };
};
