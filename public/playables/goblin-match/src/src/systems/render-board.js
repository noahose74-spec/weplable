import { SPECIAL_TYPES, TILE_KIND } from "../config/constants.js";
import { BLOCK_IMAGES } from "../data/visuals.js";
import { GOBLINS } from "../data/goblins.js";
import { TUNING } from "../config/tuning.js";

const ASSETS = {
  boardTile: "./public/COMPONENTS/tile/img_basic_tile.png",
  boardCornerA: "./public/COMPONENTS/tile/corner1.png",
  boardCornerB: "./public/COMPONENTS/tile/corner2.png",
  boardEdgeVerticalA: "./public/COMPONENTS/tile/left1.png",
  boardEdgeVerticalB: "./public/COMPONENTS/tile/left2.png",
  boardEdgeHorizontalA: "./public/COMPONENTS/tile/bottom1.png",
  boardEdgeHorizontalB: "./public/COMPONENTS/tile/bottom2.png",
  validMove: "./public/COMPONENTS/Merge_IngameUI/_0003_Select01.png",
  leaderRing: "./public/COMPONENTS/Merge_IngameUI/_0004_Select02.png",
  obstacle: "./public/COMPONENTS/Merge_IngameUI/_0001_Tile01.png",
  goalItem: "./public/icons/img_box_normal.png",
  specialBlocks: {
    propeller: "./public/COMPONENTS/GameObjects/Propeller.png",
    [SPECIAL_TYPES.LINE_ROW]: "./public/COMPONENTS/GameObjects/Rocket_Width.png",
    [SPECIAL_TYPES.LINE_COLUMN]: "./public/COMPONENTS/GameObjects/Rocket_Length.png",
    [SPECIAL_TYPES.BOMB]: "./public/COMPONENTS/GameObjects/Bomb.png",
    [SPECIAL_TYPES.RAINBOW]: "./public/COMPONENTS/GameObjects/Rainbow.png",
  },
};

const ITEM_PORTRAITS = Object.fromEntries(GOBLINS.map((goblin) => [goblin.id, goblin.portrait]));

const isValidMove = (validMoves, x, y) => validMoves.some((point) => point.x === x && point.y === y);
const isRecentClear = (recentClears, x, y) =>
  recentClears.some((point) => point.x === x && point.y === y);
const isRecentGoblinMatchCell = (recentGoblinMatchCells, x, y) =>
  recentGoblinMatchCells.some((point) => point.x === x && point.y === y);
const getFallInfo = (recentFalls, tileId) => recentFalls.find((entry) => entry.tileId === tileId) ?? null;
const getBlockImage = (color) => BLOCK_IMAGES[color] ?? "";
const getSpecialBlockImage = (specialType) => ASSETS.specialBlocks[specialType] ?? "";

const lerp = (start, end, progress) => start + ((end - start) * progress);
const easeInOutCubic = (progress) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;

const getDisplayCamera = (game, moveAnimation) => {
  if (!moveAnimation) {
    return game.camera;
  }

  const eased = easeInOutCubic(moveAnimation.progress);

  return {
    x: lerp(moveAnimation.fromCamera.x, moveAnimation.toCamera.x, eased),
    y: lerp(moveAnimation.fromCamera.y, moveAnimation.toCamera.y, eased),
  };
};

const getDragPreviewPosition = (game, dragState) => {
  if (!dragState.active || !dragState.hoverTarget || !dragState.origin) {
    return game.leaderPosition;
  }

  const direction = {
    x: dragState.hoverTarget.x - dragState.origin.x,
    y: dragState.hoverTarget.y - dragState.origin.y,
  };
  const directionLength = Math.hypot(direction.x, direction.y);

  if (!directionLength || !dragState.pointer || !dragState.startPointer) {
    return game.leaderPosition;
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
  const progress = Math.min(Math.max(projectedDistance / TUNING.dragPreviewDistancePx, 0), 1);

  return {
    x: dragState.origin.x + (direction.x * progress),
    y: dragState.origin.y + (direction.y * progress),
  };
};

const getDisplayLeaderPosition = (game, dragState, moveAnimation) => {
  if (moveAnimation) {
    const eased = easeInOutCubic(moveAnimation.progress);

    return {
      x: lerp(moveAnimation.from.x, moveAnimation.to.x, eased),
      y: lerp(moveAnimation.from.y, moveAnimation.to.y, eased),
    };
  }

  return getDragPreviewPosition(game, dragState);
};

const getPreviewCamera = (game, dragState) => {
  const previewPosition = getDragPreviewPosition(game, dragState);
  return {
    x: Math.min(
      Math.max(previewPosition.x - Math.floor(game.stage.viewWidth / 2), 0),
      Math.max(0, game.stage.width - game.stage.viewWidth),
    ),
    y: Math.min(
      Math.max(previewPosition.y - Math.floor(game.stage.viewHeight / 2), 0),
      Math.max(0, game.stage.height - game.stage.viewHeight),
    ),
  };
};

const renderLeaderOverlay = (game, dragState, moveAnimation, displayCamera, displayLeaderPosition) => {
  const localX = displayLeaderPosition.x - displayCamera.x;
  const localY = displayLeaderPosition.y - displayCamera.y;

  return `
    <div class="leader-overlay ${moveAnimation ? "is-animating" : ""}" style="--leader-local-x:${localX}; --leader-local-y:${localY};">
      <span class="leader-figure leader-${game.leader.color} ${moveAnimation ? "is-moving" : ""} ${game.recentGoblinMatch ? "is-goblin-match" : ""} ${game.goblinBuffTurns > 0 ? "is-buffed" : ""}">
        <img src="${game.leader.portrait}" alt="${game.leader.name}" />
      </span>
      ${
        game.recentGoblinMatch
          ? '<span class="goblin-match-badge">GOBLIN MATCH</span>'
          : game.goblinBuffTurns > 0
            ? `<span class="goblin-match-badge is-buff">BUFF ${game.goblinBuffTurns}</span>`
            : ""
      }
    </div>
  `;
};

const renderItemOverlay = (game, itemAnimation, displayCamera) => {
  if (!itemAnimation) {
    return "";
  }

  const localX = itemAnimation.target.x - displayCamera.x;
  const localY = itemAnimation.target.y - displayCamera.y;

  return `
    <div class="item-overlay is-activating" style="--leader-local-x:${localX}; --leader-local-y:${localY}; --item-progress:${itemAnimation.progress};">
      <span class="leader-figure item-figure item-${itemAnimation.id}">
        <img src="${ITEM_PORTRAITS[itemAnimation.id]}" alt="${itemAnimation.id} item goblin" />
      </span>
      <span class="item-activation-ring"></span>
    </div>
  `;
};

export const renderBoard = (game, pendingItem, dragState, moveAnimation, itemAnimation) => {
  const { board, leaderPosition, validMoves, recentClears, recentFalls, recentGoblinMatchCells, stage } = game;
  const currentTargets = dragState.active && dragState.mode === "block" ? dragState.validTargets : validMoves;
  const displayLeaderPosition = getDisplayLeaderPosition(game, dragState, moveAnimation);
  const displayCamera = moveAnimation
    ? getDisplayCamera(game, moveAnimation)
    : dragState.active
      ? getPreviewCamera(game, dragState)
      : game.camera;

  return `
    <div
      class="board-viewport"
      style="--view-columns:${stage.viewWidth}; --view-rows:${stage.viewHeight};"
    >
      <div class="board-window">
        <div
          class="board-grid ${dragState.active ? "is-dragging" : ""}"
          style="
            --board-columns:${board[0].length};
            --camera-x:${displayCamera.x};
            --camera-y:${displayCamera.y};
          "
        >
          ${board
            .flatMap((row, y) =>
              row.map((tile, x) => {
                const leaderHere = leaderPosition.x === x && leaderPosition.y === y;
                const moveHere = isValidMove(currentTargets, x, y);
                const dragHover =
                  dragState.hoverTarget?.x === x && dragState.hoverTarget?.y === y;
                const recentlyCleared = isRecentClear(recentClears, x, y);
                const goblinMatchCell = isRecentGoblinMatchCell(recentGoblinMatchCells, x, y);
                const fallInfo = tile?.id ? getFallInfo(recentFalls, tile.id) : null;
                const interactive =
                  game.phase === "playing" &&
                  ((pendingItem?.mode === "tile") || (!pendingItem && moveHere));
                const tileClasses = [
                  "board-cell",
                  tile?.kind === TILE_KIND.OBSTACLE ? "is-obstacle" : `is-${tile?.color ?? "empty"}`,
                  leaderHere ? "has-leader" : "",
                  moveHere && !pendingItem ? "is-valid-move" : "",
                  pendingItem?.mode === "tile" ? "is-targetable" : "",
                  dragHover ? "is-drag-hover" : "",
                  recentlyCleared ? "is-recent-clear" : "",
                  goblinMatchCell ? "is-goblin-match-cell" : "",
                  fallInfo ? "is-falling" : "",
                  tile?.special ? `special-${tile.special.type}` : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return `
                  <button
                    class="${tileClasses}"
                    data-action="board-cell"
                    data-x="${x}"
                    data-y="${y}"
                    data-valid-move="${moveHere ? "true" : "false"}"
                    data-leader-cell="${leaderHere ? "true" : "false"}"
                    data-block-cell="${tile?.kind === TILE_KIND.BLOCK && !leaderHere ? "true" : "false"}"
                    style="background-image:url('${ASSETS.boardTile}');${fallInfo ? `--fall-distance:${fallInfo.distance};` : ""}"
                    ${interactive ? "" : 'tabindex="-1"'}
                    aria-label="Board cell ${x + 1}, ${y + 1}"
                  >
                    ${
                      tile?.kind === TILE_KIND.OBSTACLE
                        ? `<span class="tile-obstacle" style="background-image:url('${ASSETS.obstacle}')" aria-label="Crate"></span>`
                        : tile?.kind === TILE_KIND.GOAL_ITEM
                          ? `<span class="tile-goal-item" style="background-image:url('${ASSETS.goalItem}')" aria-label="Relic item"></span>`
                      : tile?.kind === TILE_KIND.BLOCK && tile?.special && getSpecialBlockImage(tile.special.type)
                        ? `
                          <span class="tile-gem tile-gem-special gem-${tile?.color}">
                            <img class="tile-special-image" src="${getSpecialBlockImage(tile.special.type)}" alt="${tile.special.type} special block" draggable="false" />
                          </span>
                        `
                        : tile?.kind === TILE_KIND.BLOCK && getBlockImage(tile.color)
                          ? `
                            <span class="tile-gem gem-${tile?.color}">
                              <img class="tile-gem-image" src="${getBlockImage(tile.color)}" alt="${tile.color ?? "unknown"} block" draggable="false" />
                            </span>
                          `
                      : ""
                    }
                    ${
                      moveHere && !pendingItem
                        ? `<img class="tile-overlay tile-valid" src="${ASSETS.validMove}" alt="" />`
                        : ""
                    }
                    ${recentlyCleared ? '<span class="tile-impact-range" aria-hidden="true"></span>' : ""}
                    ${recentlyCleared ? '<span class="tile-clear-burst" aria-hidden="true"></span>' : ""}
                  </button>
                `;
              }),
            )
            .join("")}
        </div>
        ${renderLeaderOverlay(game, dragState, moveAnimation, displayCamera, displayLeaderPosition)}
        ${renderItemOverlay(game, itemAnimation, displayCamera)}
      </div>
    </div>
    <div class="board-legend">
      <span><strong>Leader:</strong> ${game.leader.name}</span>
      <span><strong>World:</strong> ${stage.width} x ${stage.height}</span>
      <span><strong>View:</strong> ${stage.viewWidth} x ${stage.viewHeight}</span>
              <span><strong>Targeting:</strong> ${
        pendingItem?.mode === "tile"
          ? "Select any tile"
          : pendingItem?.mode === "color"
            ? "Select a color button"
            : dragState.active
              ? dragState.mode === "block"
                ? "Drag a block to a highlighted adjacent tile to swap"
                : "Drag to a highlighted adjacent tile and release"
              : moveAnimation
                ? "Moving..."
              : itemAnimation
                ? "Goblin item activating..."
              : "Drag the goblin or a normal block to a highlighted adjacent tile"
      }</span>
      <span><strong>Specials:</strong> 4-line = Rocket, 5-line = Light Ball, T/L = TNT</span>
      <span><strong>Goblin Match:</strong> Match the leader inside the line for a stronger effect and 2-turn buff.</span>
    </div>
  `;
};
