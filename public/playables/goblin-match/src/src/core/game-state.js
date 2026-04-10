import { DIRECTIONS_4, DIRECTIONS_8, ITEM_TARGETING } from "../config/constants.js";
import { STAGES } from "../data/stages.js";
import { GOBLINS } from "../data/goblins.js";
import {
  createBoard,
  cloneBoard,
  countGoalItems,
  findLeaderStart,
  isWalkableCell,
  refillMissingBlocks,
  swapTiles,
} from "./board.js";
import { createGoalState, updateGoalState, isGoalComplete } from "./goals.js";
import { resolveBoard, applyItemEffect, resolveSwapSpecialActivation } from "./resolver.js";
import { getNeighbors8 } from "../utils/grid.js";
import { TUNING } from "../config/tuning.js";
import { findMatches } from "./match-finder.js";
import { getTile } from "./board.js";

export const createAppState = () => ({
  screen: "leader-select",
  selectedLeaderId: null,
  selectedStageId: STAGES[1]?.id ?? STAGES[0].id,
  game: null,
  pendingItem: null,
  moveAnimation: null,
  itemAnimation: null,
  effectQueue: [],
  dragState: {
    active: false,
    mode: "leader",
    hoverTarget: null,
    pointer: null,
    startPointer: null,
    origin: null,
    validTargets: [],
  },
  logs: ["Choose a leader goblin to start the stage."],
});

export const getGoblinById = (goblinId) => GOBLINS.find((goblin) => goblin.id === goblinId);

const buildItemState = (leaderId) =>
  GOBLINS.filter((goblin) => goblin.id !== leaderId).map((goblin) => ({
    id: goblin.id,
    used: false,
  }));

const pickDragTargetFromPointer = (state, pointer) => {
  const { dragState, game } = state;

  if (!dragState.active || !pointer || !dragState.startPointer || !dragState.origin) {
    return null;
  }

  const delta = {
    x: pointer.x - dragState.startPointer.x,
    y: pointer.y - dragState.startPointer.y,
  };
  const distance = Math.hypot(delta.x, delta.y);

  if (distance < 10) {
    return null;
  }

  const normalized = {
    x: delta.x / distance,
    y: delta.y / distance,
  };

  let bestMove = null;
  let bestScore = 0.55;

  const targetPool = dragState.mode === "block" ? dragState.validTargets : game.validMoves;

  targetPool.forEach((move) => {
    const direction = {
      x: move.x - dragState.origin.x,
      y: move.y - dragState.origin.y,
    };
    const directionLength = Math.hypot(direction.x, direction.y);
    if (!directionLength) {
      return;
    }

    const score =
      ((direction.x / directionLength) * normalized.x) +
      ((direction.y / directionLength) * normalized.y);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  });

  return bestMove;
};

export const getCameraPosition = (stage, leaderPosition) => {
  const halfWidth = Math.floor(stage.viewWidth / 2);
  const halfHeight = Math.floor(stage.viewHeight / 2);
  const maxX = Math.max(0, stage.width - stage.viewWidth);
  const maxY = Math.max(0, stage.height - stage.viewHeight);

  return {
    x: Math.min(Math.max(leaderPosition.x - halfWidth, 0), maxX),
    y: Math.min(Math.max(leaderPosition.y - halfHeight, 0), maxY),
  };
};

export const getValidMoves = (board, leaderPosition) =>
  getNeighbors8(board[0].length, board.length, leaderPosition.x, leaderPosition.y, DIRECTIONS_8).filter(
    (point) => isWalkableCell(board, point.x, point.y),
  );

export const getValidBlockSwaps = (board, origin) =>
  getNeighbors8(board[0].length, board.length, origin.x, origin.y, DIRECTIONS_4).filter(
    (point) => isWalkableCell(board, point.x, point.y),
  );

export const startGame = (state, leaderId, stageId = state.selectedStageId) => {
  const stage = STAGES.find((entry) => entry.id === stageId) ?? STAGES[0];
  const leader = getGoblinById(leaderId);
  let board = null;
  let leaderPosition = null;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    board = createBoard(stage, leader.color);
    refillMissingBlocks(board);
    leaderPosition = findLeaderStart(board, stage.width, stage.height, stage.leaderStart);
    const initialMatches = findMatches(board, {
      leaderPosition,
      leaderColor: leader.color,
    });

    if (!initialMatches.matchedCells.length) {
      break;
    }
  }

  return {
    ...state,
    screen: "game",
    selectedLeaderId: leaderId,
    selectedStageId: stage.id,
    pendingItem: null,
    moveAnimation: null,
    itemAnimation: null,
    effectQueue: [],
    dragState: {
      active: false,
      mode: "leader",
      hoverTarget: null,
      pointer: null,
      startPointer: null,
      origin: null,
      validTargets: [],
    },
    logs: [`${leader.name} selected. Move one tile to resolve the board.`],
    game: {
      stage,
      leader,
      board,
      leaderPosition,
      camera: getCameraPosition(stage, leaderPosition),
      validMoves: getValidMoves(board, leaderPosition),
      turnsRemaining: stage.turns,
      goalState: createGoalState(stage),
      itemState: buildItemState(leaderId),
      phase: "playing",
      result: null,
      highlightedCells: [],
      lastResolution: null,
      recentClears: [],
      recentFalls: [],
      recentGoblinMatch: false,
      recentGoblinMatchCells: [],
      effectVersion: 0,
      goblinBuffTurns: 0,
    },
  };
};

const appendLogs = (state, messages) => ({
  ...state,
  logs: [...messages, ...state.logs].slice(0, TUNING.maxLoggedEffects),
});

const finalizeProgress = (game, resolution) => {
  let nextGoalState = updateGoalState(game.goalState, resolution);

  if (nextGoalState.type === "goal-items") {
    const remaining = countGoalItems(game.board);
    nextGoalState = {
      ...nextGoalState,
      progress: Math.max(0, nextGoalState.target - remaining),
      remaining,
    };
  }

  let nextPhase = game.phase;
  let result = game.result;

  if (isGoalComplete(nextGoalState)) {
    nextPhase = "victory-delay";
    result = "Victory!";
  } else if (game.turnsRemaining <= 0) {
    nextPhase = "lost";
    result = "Out of turns";
  }

  return {
    ...game,
    goalState: nextGoalState,
    phase: nextPhase,
    result,
  };
};

const createEffectQueue = (timeline) =>
  timeline.slice(0, TUNING.maxEffectSteps).map((step) => ({
    clears: step.cleared,
    falls: step.falls ?? [],
    events: step.effectEvents ?? [],
    goblinMatch: step.goblinMatch ?? false,
    goblinMatchCells: step.goblinMatchCells ?? [],
  }));

const getFirstEffectStep = (timeline) =>
  timeline.length
    ? {
        clears: timeline[0].cleared,
        falls: timeline[0].falls ?? [],
        goblinMatch: timeline[0].goblinMatch ?? false,
        goblinMatchCells: timeline[0].goblinMatchCells ?? [],
      }
    : {
        clears: [],
        falls: [],
        goblinMatch: false,
        goblinMatchCells: [],
      };

export const moveLeader = (state, target) => {
  const game = state.game;
  if (!game || game.phase !== "playing" || state.moveAnimation || state.itemAnimation) {
    return state;
  }

  const isValid = game.validMoves.some((point) => point.x === target.x && point.y === target.y);
  if (!isValid) {
    return appendLogs(state, ["That tile is not a valid move."]);
  }

  const board = cloneBoard(game.board);
  const startTile = getTile(game.board, game.leaderPosition.x, game.leaderPosition.y);
  const endTile = getTile(game.board, target.x, target.y);

  let preResolution = null;
  if (startTile?.special || endTile?.special) {
    preResolution = resolveSwapSpecialActivation(
      board,
      game.leaderPosition,
      startTile,
      target,
      endTile,
    );
  } else {
    swapTiles(board, game.leaderPosition, target);
  }

  const cascadeResolution = resolveBoard(board, {
    leader: game.leader,
    leaderColor: game.leader.color,
    leaderPosition: target,
    lastMoveTarget: target,
    goalTargetColor: null,
    buffTurnsActive: game.goblinBuffTurns,
  });

  const resolution = {
    board,
    obstaclesCleared: (preResolution?.summary.obstaclesCleared ?? 0) + cascadeResolution.obstaclesCleared,
    blocksCleared: (preResolution?.summary.blocksCleared ?? 0) + cascadeResolution.blocksCleared,
    goalItemsCleared: (preResolution?.summary.goalItemsCleared ?? 0) + cascadeResolution.goalItemsCleared,
    targetColorCleared: cascadeResolution.targetColorCleared,
    leaderMatches: cascadeResolution.leaderMatches,
    goblinMatches: (preResolution?.step.goblinMatch ? 1 : 0) + cascadeResolution.goblinMatches,
    timeline: [
      ...(preResolution ? [preResolution.step] : []),
      ...cascadeResolution.timeline,
    ],
  };
  refillMissingBlocks(board);

  const turnsRemaining = game.turnsRemaining - 1;
  let effectTimeline = [...resolution.timeline];
  const nextBuffTurns =
    resolution.goblinMatches > 0
      ? TUNING.goblinBuffTurns
      : Math.max(0, game.goblinBuffTurns - 1);
  let nextGame = finalizeProgress(
    {
      ...game,
      board,
      leaderPosition: target,
      camera: getCameraPosition(game.stage, target),
      turnsRemaining,
      lastResolution: resolution,
      recentClears: [],
      recentFalls: [],
      recentGoblinMatch: false,
      recentGoblinMatchCells: [],
      effectVersion: game.effectVersion + 1,
      goblinBuffTurns: nextBuffTurns,
    },
    resolution,
  );

  const firstEffect = getFirstEffectStep(effectTimeline);
  nextGame = {
    ...nextGame,
    recentClears: firstEffect.clears,
    recentFalls: firstEffect.falls,
    recentGoblinMatch: firstEffect.goblinMatch,
    recentGoblinMatchCells: firstEffect.goblinMatchCells,
  };

  nextGame.validMoves = getValidMoves(nextGame.board, nextGame.leaderPosition);

  return appendLogs(
    {
      ...state,
      pendingItem: null,
      moveAnimation: null,
      itemAnimation: null,
      effectQueue: createEffectQueue(effectTimeline).slice(1),
      dragState: {
        active: false,
        mode: "leader",
        hoverTarget: null,
        pointer: null,
        startPointer: null,
        origin: null,
        validTargets: [],
      },
      game: nextGame,
    },
    [
      `Leader moved to (${target.x + 1}, ${target.y + 1}).`,
      ...(resolution.goblinMatches ? [`Goblin Match buff active for ${TUNING.goblinBuffTurns} turns.`] : []),
      ...effectTimeline.flatMap((step) => step.effectEvents),
      resolution.timeline.length ? `Resolved ${resolution.timeline.length} cascade(s).` : "No matches.",
    ],
  );
};

export const queueItemUse = (state, itemId) => {
  const game = state.game;
  if (!game || game.phase !== "playing" || state.moveAnimation || state.itemAnimation) {
    return state;
  }

  const itemState = game.itemState.find((item) => item.id === itemId);
  if (!itemState || itemState.used) {
    return appendLogs(state, ["That item has already been used."]);
  }

  const targetMode = ITEM_TARGETING.TILE;

  const nextState = {
    ...state,
    pendingItem: {
      id: itemId,
      mode: targetMode,
    },
    moveAnimation: null,
    itemAnimation: null,
    dragState: {
      active: false,
      mode: "leader",
      hoverTarget: null,
      pointer: null,
      startPointer: null,
      origin: null,
      validTargets: [],
    },
  };

  return appendLogs(nextState, [
    "Select a board tile to place the goblin item.",
  ]);
};

const markItemUsed = (itemState, itemId) =>
  itemState.map((item) => (item.id === itemId ? { ...item, used: true } : item));

export const useQueuedItem = (state, payload = null) => {
  const game = state.game;
  const pendingItem = state.pendingItem;

  if (!game || game.phase !== "playing" || !pendingItem || state.moveAnimation) {
    return state;
  }

  if (pendingItem.mode === ITEM_TARGETING.TILE && payload?.x === undefined) {
    return appendLogs(state, ["Select a board tile first."]);
  }

  const board = cloneBoard(game.board);
  const itemResolution = applyItemEffect(board, pendingItem.id, payload);
  const cascadeResolution = resolveBoard(board, {
    leader: game.leader,
    leaderColor: game.leader.color,
    leaderPosition: game.leaderPosition,
    lastMoveTarget: game.leaderPosition,
    goalTargetColor: null,
    buffTurnsActive: game.goblinBuffTurns,
  });
  const resolution = {
    board,
    obstaclesCleared: itemResolution.obstaclesCleared + cascadeResolution.obstaclesCleared,
    blocksCleared: itemResolution.blocksCleared + cascadeResolution.blocksCleared,
    goalItemsCleared: itemResolution.goalItemsCleared + cascadeResolution.goalItemsCleared,
    targetColorCleared: itemResolution.targetColorCleared + cascadeResolution.targetColorCleared,
    leaderMatches: cascadeResolution.leaderMatches,
    goblinMatches: cascadeResolution.goblinMatches,
    timeline: cascadeResolution.timeline,
    effectEvents: [
      ...itemResolution.effectEvents,
      ...cascadeResolution.timeline.flatMap((step) => step.effectEvents),
      ...(cascadeResolution.timeline.length ? [`Resolved ${cascadeResolution.timeline.length} cascade(s).`] : []),
    ],
  };
  refillMissingBlocks(board);
  let effectTimeline = [...resolution.timeline];
  let nextGame = finalizeProgress(
    {
      ...game,
      board,
      itemState: markItemUsed(game.itemState, pendingItem.id),
      lastResolution: resolution,
      recentClears: [],
      recentFalls: [],
      recentGoblinMatch: false,
      recentGoblinMatchCells: [],
      effectVersion: game.effectVersion + 1,
      camera: getCameraPosition(game.stage, game.leaderPosition),
      goblinBuffTurns:
        resolution.goblinMatches > 0 ? TUNING.goblinBuffTurns : game.goblinBuffTurns,
    },
    resolution,
  );

  const firstEffect = getFirstEffectStep(effectTimeline);
  nextGame = {
    ...nextGame,
    recentClears: firstEffect.clears,
    recentFalls: firstEffect.falls,
    recentGoblinMatch: firstEffect.goblinMatch,
    recentGoblinMatchCells: firstEffect.goblinMatchCells,
  };

  nextGame.validMoves = getValidMoves(nextGame.board, nextGame.leaderPosition);

  return appendLogs(
    {
      ...state,
      pendingItem: null,
      moveAnimation: null,
      itemAnimation: null,
      effectQueue: createEffectQueue(effectTimeline).slice(1),
      dragState: {
        active: false,
        mode: "leader",
        hoverTarget: null,
        pointer: null,
        startPointer: null,
        origin: null,
        validTargets: [],
      },
      game: nextGame,
    },
    [
      ...(resolution.goblinMatches ? [`Goblin Match buff active for ${TUNING.goblinBuffTurns} turns.`] : []),
      ...resolution.effectEvents,
      ...effectTimeline.slice(resolution.timeline.length).flatMap((step) => step.effectEvents),
      `${getGoblinById(pendingItem.id).name} item used.`,
    ],
  );
};

export const restartGame = (state) =>
  state.selectedLeaderId ? startGame(state, state.selectedLeaderId, state.selectedStageId) : createAppState();

export const selectStage = (state, stageId) => ({
  ...state,
  selectedStageId: stageId,
  logs: [`${(STAGES.find((stage) => stage.id === stageId) ?? STAGES[0]).difficulty} stage selected.`],
});

export const clearRecentEffects = (state, effectVersion) => {
  if (!state.game || state.game.effectVersion !== effectVersion) {
    return state;
  }

  if (state.effectQueue.length) {
    const [nextStep, ...rest] = state.effectQueue;
    return {
      ...state,
      effectQueue: rest,
      game: {
        ...state.game,
        recentClears: nextStep.clears,
        recentFalls: nextStep.falls,
        recentGoblinMatch: nextStep.goblinMatch,
        recentGoblinMatchCells: nextStep.goblinMatchCells,
      },
    };
  }

  if (
    !state.game.recentClears.length &&
    !state.game.recentFalls.length &&
    !state.game.recentGoblinMatch
  ) {
    return state;
  }

  return {
    ...state,
    effectQueue: [],
    game: {
      ...state.game,
      recentClears: [],
      recentFalls: [],
      recentGoblinMatch: false,
      recentGoblinMatchCells: [],
    },
  };
};

export const finishVictoryDelay = (state) => {
  if (!state.game || state.game.phase !== "victory-delay") {
    return state;
  }

  return {
    ...state,
    game: {
      ...state.game,
      phase: "won",
      result: "Victory!",
    },
  };
};

export const beginLeaderDrag = (state, pointer = null) => {
  if (
    !state.game ||
    state.game.phase !== "playing" ||
    state.pendingItem ||
    state.moveAnimation ||
    state.itemAnimation
  ) {
    return state;
  }

  return {
    ...state,
    dragState: {
      active: true,
      mode: "leader",
      hoverTarget: null,
      pointer,
      startPointer: pointer,
      origin: state.game.leaderPosition,
      validTargets: [],
    },
  };
};

export const beginBlockDrag = (state, origin, pointer = null) => {
  if (
    !state.game ||
    state.game.phase !== "playing" ||
    state.pendingItem ||
    state.moveAnimation ||
    state.itemAnimation
  ) {
    return state;
  }

  return {
    ...state,
    dragState: {
      active: true,
      mode: "block",
      hoverTarget: null,
      pointer,
      startPointer: pointer,
      origin,
      validTargets: getValidBlockSwaps(state.game.board, origin),
    },
  };
};

export const updateLeaderDrag = (state, _target, pointer = null) => {
  if (!state.dragState.active) {
    return state;
  }

  const hoverTarget = pickDragTargetFromPointer(state, pointer);

  return {
    ...state,
    dragState: {
      ...state.dragState,
      hoverTarget,
      pointer,
    },
  };
};

export const cancelLeaderDrag = (state) => {
  if (!state.dragState.active && !state.dragState.hoverTarget) {
    return state;
  }

  return {
    ...state,
    dragState: {
      active: false,
      mode: "leader",
      hoverTarget: null,
      pointer: null,
      startPointer: null,
      origin: null,
      validTargets: [],
    },
  };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getDragPreviewProgress = (dragState) => {
  if (
    !dragState.active ||
    !dragState.hoverTarget ||
    !dragState.pointer ||
    !dragState.startPointer ||
    !dragState.origin
  ) {
    return 0;
  }

  const direction = {
    x: dragState.hoverTarget.x - dragState.origin.x,
    y: dragState.hoverTarget.y - dragState.origin.y,
  };
  const directionLength = Math.hypot(direction.x, direction.y);

  if (!directionLength) {
    return 0;
  }

  const pointerDelta = {
    x: dragState.pointer.x - dragState.startPointer.x,
    y: dragState.pointer.y - dragState.startPointer.y,
  };
  const normalized = {
    x: direction.x / directionLength,
    y: direction.y / directionLength,
  };
  const projectedDistance = (pointerDelta.x * normalized.x) + (pointerDelta.y * normalized.y);

  return clamp(projectedDistance / TUNING.dragPreviewDistancePx, 0, 1);
};

export const beginMoveAnimation = (state, target) => {
  if (!state.game || state.moveAnimation || state.itemAnimation) {
    return state;
  }

  const previewProgress = getDragPreviewProgress(state.dragState);
  const from =
    previewProgress > 0 && state.dragState.origin
      ? {
          x: state.dragState.origin.x + ((target.x - state.dragState.origin.x) * previewProgress),
          y: state.dragState.origin.y + ((target.y - state.dragState.origin.y) * previewProgress),
        }
      : state.game.leaderPosition;
  const fromCamera =
    previewProgress > 0
      ? getCameraPosition(state.game.stage, from)
      : state.game.camera;

  return {
    ...state,
    pendingItem: null,
    dragState: {
      active: false,
      mode: "leader",
      hoverTarget: null,
      pointer: null,
      startPointer: null,
      origin: null,
      validTargets: [],
    },
    moveAnimation: {
      from,
      to: target,
      fromCamera,
      toCamera: getCameraPosition(state.game.stage, target),
      progress: 0,
    },
  };
};

export const beginItemAnimation = (state, target) => {
  if (!state.game || !state.pendingItem || state.moveAnimation || state.itemAnimation) {
    return state;
  }

  return {
    ...state,
    dragState: {
      active: false,
      mode: "leader",
      hoverTarget: null,
      pointer: null,
      startPointer: null,
      origin: null,
      validTargets: [],
    },
    itemAnimation: {
      id: state.pendingItem.id,
      target,
      progress: 0,
    },
  };
};

export const updateItemAnimation = (state, progress) => {
  if (!state.itemAnimation) {
    return state;
  }

  return {
    ...state,
    itemAnimation: {
      ...state.itemAnimation,
      progress,
    },
  };
};

export const finishItemAnimation = (state) => {
  if (!state.itemAnimation) {
    return state;
  }

  return useQueuedItem(
    {
      ...state,
      itemAnimation: null,
    },
    state.itemAnimation.target,
  );
};

export const updateMoveAnimation = (state, progress) => {
  if (!state.moveAnimation) {
    return state;
  }

  return {
    ...state,
    moveAnimation: {
      ...state.moveAnimation,
      progress,
    },
  };
};

export const finishMoveAnimation = (state) => {
  if (!state.moveAnimation) {
    return state;
  }

  return moveLeader(
    {
      ...state,
      moveAnimation: null,
    },
    state.moveAnimation.to,
  );
};

export const swapNormalBlocks = (state, origin, target) => {
  const game = state.game;
  if (!game || game.phase !== "playing" || state.moveAnimation || state.itemAnimation) {
    return state;
  }

  const isValid = getValidBlockSwaps(game.board, origin).some((point) => point.x === target.x && point.y === target.y);
  if (!isValid) {
    return appendLogs(state, ["That block swap is not valid."]);
  }

  const board = cloneBoard(game.board);
  const startTile = getTile(game.board, origin.x, origin.y);
  const endTile = getTile(game.board, target.x, target.y);

  let preResolution = null;
  swapTiles(board, origin, target);
  if (startTile?.special || endTile?.special) {
    preResolution = resolveSwapSpecialActivation(board, target, startTile, origin, endTile);
  }

  const cascadeResolution = resolveBoard(board, {
    leader: game.leader,
    leaderColor: game.leader.color,
    leaderPosition: game.leaderPosition,
    lastMoveTarget: target,
    goalTargetColor: null,
    buffTurnsActive: game.goblinBuffTurns,
  });

  const resolution = {
    board,
    obstaclesCleared: (preResolution?.summary.obstaclesCleared ?? 0) + cascadeResolution.obstaclesCleared,
    blocksCleared: (preResolution?.summary.blocksCleared ?? 0) + cascadeResolution.blocksCleared,
    goalItemsCleared: (preResolution?.summary.goalItemsCleared ?? 0) + cascadeResolution.goalItemsCleared,
    targetColorCleared: cascadeResolution.targetColorCleared,
    leaderMatches: cascadeResolution.leaderMatches,
    goblinMatches: (preResolution?.step.goblinMatch ? 1 : 0) + cascadeResolution.goblinMatches,
    timeline: [
      ...(preResolution ? [preResolution.step] : []),
      ...cascadeResolution.timeline,
    ],
  };
  refillMissingBlocks(board);

  if (!resolution.timeline.length) {
    return appendLogs(
      {
        ...state,
        dragState: {
          active: false,
          mode: "leader",
          hoverTarget: null,
          pointer: null,
          startPointer: null,
          origin: null,
          validTargets: [],
        },
      },
      ["Normal block swaps need to create a match or trigger a special block."],
    );
  }

  const turnsRemaining = game.turnsRemaining - 1;
  let effectTimeline = [...resolution.timeline];
  const nextBuffTurns =
    resolution.goblinMatches > 0
      ? TUNING.goblinBuffTurns
      : Math.max(0, game.goblinBuffTurns - 1);
  let nextGame = finalizeProgress(
    {
      ...game,
      board,
      turnsRemaining,
      lastResolution: resolution,
      recentClears: [],
      recentFalls: [],
      recentGoblinMatch: false,
      recentGoblinMatchCells: [],
      effectVersion: game.effectVersion + 1,
      goblinBuffTurns: nextBuffTurns,
    },
    resolution,
  );

  const firstEffect = getFirstEffectStep(effectTimeline);
  nextGame = {
    ...nextGame,
    recentClears: firstEffect.clears,
    recentFalls: firstEffect.falls,
    recentGoblinMatch: firstEffect.goblinMatch,
    recentGoblinMatchCells: firstEffect.goblinMatchCells,
  };

  nextGame.validMoves = getValidMoves(nextGame.board, nextGame.leaderPosition);

  return appendLogs(
    {
      ...state,
      pendingItem: null,
      effectQueue: createEffectQueue(effectTimeline).slice(1),
      dragState: {
        active: false,
        mode: "leader",
        hoverTarget: null,
        pointer: null,
        startPointer: null,
        origin: null,
        validTargets: [],
      },
      game: nextGame,
    },
    [
      `Blocks swapped from (${origin.x + 1}, ${origin.y + 1}) to (${target.x + 1}, ${target.y + 1}).`,
      ...(resolution.goblinMatches ? [`Goblin Match buff active for ${TUNING.goblinBuffTurns} turns.`] : []),
      ...effectTimeline.flatMap((step) => step.effectEvents),
      `Resolved ${resolution.timeline.length} cascade(s).`,
    ],
  );
};
