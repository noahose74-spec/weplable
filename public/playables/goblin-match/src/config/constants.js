export const COLORS = ["red", "blue", "green", "yellow"];

export const COLOR_LABELS = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
};

export const SPECIAL_TYPES = {
  LINE_ROW: "line-row",
  LINE_COLUMN: "line-column",
  BOMB: "bomb",
  RAINBOW: "rainbow",
};

export const ITEM_TARGETING = {
  NONE: "none",
  TILE: "tile",
  COLOR: "color",
};

export const TILE_KIND = {
  BLOCK: "block",
  OBSTACLE: "obstacle",
  GOAL_ITEM: "goal-item",
};

export const DIRECTIONS_8 = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

export const DIRECTIONS_4 = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];
