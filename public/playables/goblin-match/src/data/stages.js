import { TUNING } from "../config/tuning.js";

export const STAGES = [
  {
    id: "easy",
    difficulty: "Easy",
    name: "Relic Warm-Up",
    width: TUNING.worldWidth,
    height: TUNING.worldHeight,
    viewWidth: TUNING.viewportWidth,
    viewHeight: TUNING.viewportHeight,
    turns: 24,
    goal: {
      type: "goal-items",
      target: 4,
      label: "Clear relic items",
    },
    obstacleCount: 24,
    goalItemCount: 4,
    leaderStart: {
      x: Math.floor(TUNING.worldWidth / 2),
      y: Math.floor(TUNING.worldHeight / 2),
    },
  },
  {
    id: "normal",
    difficulty: "Normal",
    name: "Relic Pressure",
    width: TUNING.worldWidth,
    height: TUNING.worldHeight,
    viewWidth: TUNING.viewportWidth,
    viewHeight: TUNING.viewportHeight,
    turns: TUNING.startingTurns,
    goal: {
      type: "goal-items",
      target: 6,
      label: "Clear relic items",
    },
    obstacleCount: TUNING.obstacleCount,
    goalItemCount: 6,
    leaderStart: {
      x: Math.floor(TUNING.worldWidth / 2),
      y: Math.floor(TUNING.worldHeight / 2),
    },
  },
  {
    id: "hard",
    difficulty: "Hard",
    name: "Relic Siege",
    width: TUNING.worldWidth,
    height: TUNING.worldHeight,
    viewWidth: TUNING.viewportWidth,
    viewHeight: TUNING.viewportHeight,
    turns: 16,
    goal: {
      type: "goal-items",
      target: 8,
      label: "Clear relic items",
    },
    obstacleCount: 56,
    goalItemCount: 8,
    leaderStart: {
      x: Math.floor(TUNING.worldWidth / 2),
      y: Math.floor(TUNING.worldHeight / 2),
    },
  },
];
