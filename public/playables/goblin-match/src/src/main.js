import {
  beginItemAnimation,
  beginBlockDrag,
  beginLeaderDrag,
  beginMoveAnimation,
  cancelLeaderDrag,
  clearRecentEffects,
  createAppState,
  finishItemAnimation,
  finishMoveAnimation,
  finishVictoryDelay,
  queueItemUse,
  restartGame,
  swapNormalBlocks,
  selectStage,
  startGame,
  updateItemAnimation,
  updateLeaderDrag,
  updateMoveAnimation,
} from "./core/game-state.js";
import { TUNING } from "./config/tuning.js";
import { renderLeaderSelectScreen } from "./ui/leader-select-screen.js";
import { renderGameScreen } from "./ui/game-screen.js";
import { bindInputController } from "./systems/input-controller.js";

const app = document.querySelector("#app");
let state = createAppState();
let effectTimer = null;
let moveAnimationFrame = null;
let itemAnimationFrame = null;
let victoryTimer = null;

const stopMoveAnimation = () => {
  if (moveAnimationFrame) {
    cancelAnimationFrame(moveAnimationFrame);
    moveAnimationFrame = null;
  }
};

const stopItemAnimation = () => {
  if (itemAnimationFrame) {
    cancelAnimationFrame(itemAnimationFrame);
    itemAnimationFrame = null;
  }
};

const stopVictoryTimer = () => {
  if (victoryTimer) {
    clearTimeout(victoryTimer);
    victoryTimer = null;
  }
};

const runMoveAnimation = () => {
  stopMoveAnimation();

  const startedAt = performance.now();

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - startedAt) / TUNING.moveAnimationMs);
    state = updateMoveAnimation(state, progress);
    render();

    if (progress < 1) {
      moveAnimationFrame = requestAnimationFrame(step);
      return;
    }

    moveAnimationFrame = null;
    state = finishMoveAnimation(state);
    render();
  };

  moveAnimationFrame = requestAnimationFrame(step);
};

const runItemAnimation = () => {
  stopItemAnimation();

  const startedAt = performance.now();

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - startedAt) / TUNING.itemAnimationMs);
    state = updateItemAnimation(state, progress);
    render();

    if (progress < 1) {
      itemAnimationFrame = requestAnimationFrame(step);
      return;
    }

    itemAnimationFrame = null;
    state = finishItemAnimation(state);
    render();
  };

  itemAnimationFrame = requestAnimationFrame(step);
};

const render = () => {
  if (!app) {
    return;
  }

  app.innerHTML =
    state.screen === "leader-select" ? renderLeaderSelectScreen(state) : renderGameScreen(state);

  if (effectTimer) {
    clearTimeout(effectTimer);
    effectTimer = null;
  }

  stopVictoryTimer();

  if (
    state.screen === "game" &&
    (
      state.game.recentClears.length ||
      state.game.recentFalls.length ||
      state.game.recentGoblinMatch ||
      state.effectQueue.length
    )
  ) {
    const effectVersion = state.game.effectVersion;
    effectTimer = setTimeout(() => {
      state = clearRecentEffects(state, effectVersion);
      render();
    }, 520);
  }

  if (
    state.screen === "game" &&
    state.game.phase === "victory-delay" &&
    !state.game.recentClears.length &&
    !state.game.recentFalls.length &&
    !state.game.recentGoblinMatch &&
    !state.effectQueue.length
  ) {
    victoryTimer = setTimeout(() => {
      state = finishVictoryDelay(state);
      render();
    }, TUNING.victoryDelayMs);
  }
};

bindInputController(document.body, {
  onSelectLeader: (leaderId) => {
    stopMoveAnimation();
    stopItemAnimation();
    stopVictoryTimer();
    state = startGame(state, leaderId);
    render();
  },
  onSelectStage: (stageId) => {
    state = selectStage(state, stageId);
    render();
  },
  onBoardCellClick: (point) => {
    if (state.pendingItem?.mode === "tile") {
      state = beginItemAnimation(state, point);
      render();
      runItemAnimation();
    }
  },
  onLeaderDragStart: (pointer) => {
    state = beginLeaderDrag(state, pointer);
    render();
  },
  onBlockDragStart: (origin, pointer) => {
    state = beginBlockDrag(state, origin, pointer);
    render();
  },
  onLeaderDragMove: (point, pointer) => {
    state = updateLeaderDrag(state, point?.valid ? point : null, pointer);
    render();
  },
  onAnyDragEnd: (point) => {
    const target = point?.valid ? point : state.dragState.hoverTarget;

    if (target) {
      if (state.dragState.mode === "block" && state.dragState.origin) {
        state = swapNormalBlocks(state, state.dragState.origin, target);
        render();
      } else {
        state = beginMoveAnimation(state, target);
        render();
        runMoveAnimation();
      }
    } else {
      state = cancelLeaderDrag(state);
      render();
    }
  },
  onLeaderDragCancel: () => {
    state = cancelLeaderDrag(state);
    render();
  },
  onUseItem: (itemId) => {
    state = queueItemUse(state, itemId);
    render();
  },
  onPickColor: () => {},
  onRestart: () => {
    stopMoveAnimation();
    stopItemAnimation();
    stopVictoryTimer();
    state = restartGame(state);
    render();
  },
  onBackToSelect: () => {
    stopMoveAnimation();
    stopItemAnimation();
    stopVictoryTimer();
    state = createAppState();
    render();
  },
});

render();
