export const createGoalState = (stage) => ({
  type: stage.goal.type,
  target: stage.goal.target,
  progress: 0,
  remaining: stage.goal.target,
  label: stage.goal.label,
});

export const updateGoalState = (goalState, resolution) => {
  if (goalState.type === "obstacles") {
    const progress = Math.min(goalState.target, goalState.progress + resolution.obstaclesCleared);
    return {
      ...goalState,
      progress,
      remaining: Math.max(0, goalState.target - progress),
    };
  }

  if (goalState.type === "goal-items") {
    const progress = Math.min(goalState.target, goalState.progress + resolution.goalItemsCleared);
    return {
      ...goalState,
      progress,
      remaining: Math.max(0, goalState.target - progress),
    };
  }

  if (goalState.type === "color") {
    const progress = Math.min(goalState.target, goalState.progress + resolution.targetColorCleared);
    return {
      ...goalState,
      progress,
      remaining: Math.max(0, goalState.target - progress),
    };
  }

  return goalState;
};

export const isGoalComplete = (goalState) =>
  goalState.type === "goal-items" ? goalState.remaining <= 0 : goalState.progress >= goalState.target;
