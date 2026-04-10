import { SPECIAL_TYPES } from "../config/constants.js";

export const getSpecialForGroup = (group) => {
  if (group.hasSquare) {
    return null;
  }

  const maxLine = Math.max(...group.lineLengths);

  if (maxLine >= 5) {
    return { type: SPECIAL_TYPES.RAINBOW };
  }

  if (group.isIntersecting) {
    return { type: SPECIAL_TYPES.BOMB };
  }

  if (maxLine === 4) {
    if (group.diagonal) {
      return { type: SPECIAL_TYPES.BOMB };
    }

    return {
      type: group.horizontal ? SPECIAL_TYPES.LINE_ROW : SPECIAL_TYPES.LINE_COLUMN,
    };
  }

  return null;
};

export const pickSpecialAnchor = (group, preferredCell) => {
  if (!preferredCell) {
    return group.cells[Math.floor(group.cells.length / 2)];
  }

  return (
    group.cells.find((cell) => cell.x === preferredCell.x && cell.y === preferredCell.y) ??
    group.cells[Math.floor(group.cells.length / 2)]
  );
};
