import { type BlockData, type BlockType } from '../store/gameStore';

export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 8;
export const COLORS: BlockType[] = ['RED', 'BLUE', 'YELLOW', 'GREEN'];

export function checkMatches(board: BlockData[]) {
  const matchedIds = new Set<string>();
  
  const grid: (BlockData | null)[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  
  board.forEach(b => {
    if (b.y >= 0 && b.y < BOARD_HEIGHT && b.x >= 0 && b.x < BOARD_WIDTH) {
      grid[b.y][b.x] = b;
    }
  });

  // Check horizontal
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH - 2; x++) {
      const b1 = grid[y][x];
      const b2 = grid[y][x+1];
      const b3 = grid[y][x+2];
      if (b1 && b2 && b3 && b1.type && b1.type === b2.type && b2.type === b3.type) {
        matchedIds.add(b1.id);
        matchedIds.add(b2.id);
        matchedIds.add(b3.id);
      }
    }
  }

  // Check vertical
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT - 2; y++) {
      const b1 = grid[y][x];
      const b2 = grid[y+1][x];
      const b3 = grid[y+2][x];
      if (b1 && b2 && b3 && b1.type && b1.type === b2.type && b2.type === b3.type) {
        matchedIds.add(b1.id);
        matchedIds.add(b2.id);
        matchedIds.add(b3.id);
      }
    }
  }

  return Array.from(matchedIds);
}

export function removeBlocks(board: BlockData[], matchedIds: string[]): BlockData[] {
  return board.filter(b => !matchedIds.includes(b.id)); // Just removes blocks so they visually disappear
}

export function applyGravityAndGenerate(board: BlockData[]): BlockData[] {
  // 원본 배열 복사 (순서 유지)
  let finalBoard = [...board];
  let newBlocks: BlockData[] = [];

  for (let x = 0; x < BOARD_WIDTH; x++) {
    // 1. 해당 열(x)에 남아있는 블록만 추려서 바닥(y가 큰 순서)부터 정렬
    const colBlocks = finalBoard
      .filter(b => b.x === x)
      .sort((a, b) => b.y - a.y);
    
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        const targetY = BOARD_HEIGHT - 1 - i;
        
        if (i < colBlocks.length) {
            // 2. 블록이 존재하면 원본 배열(finalBoard)에서의 인덱스를 찾음
            const blockIndex = finalBoard.findIndex(b => b.id === colBlocks[i].id);
            
            // 3. 목적지(targetY)와 현재 y가 다를 때만 객체를 업데이트 (참조 유지 & 렌더링 최적화)
            if (blockIndex !== -1 && finalBoard[blockIndex].y !== targetY) {
                finalBoard[blockIndex] = { ...finalBoard[blockIndex], y: targetY };
            }
        } else {
            // 4. 빈 자리에는 새로운 블록 생성하여 newBlocks 배열에 따로 모음
            newBlocks.push({
                id: `new-${x}-${targetY}-${Date.now()}-${Math.random()}`,
                type: COLORS[Math.floor(Math.random() * COLORS.length)],
                x: x,
                y: targetY
            });
        }
    }
  }

  // 5. 정렬(sort) 금지! 기존 DOM 노드의 순서를 완벽히 유지하고 새 블록만 끝에 붙임
  return [...finalBoard, ...newBlocks];
}

// Initial board generation assuring no straight matches
export function generateInitialBoard(): BlockData[] {
    let board: BlockData[] = [];
    do {
       board = [];
       let idCounter = 0;
       for (let y = 0; y < BOARD_HEIGHT; y++) {
         for (let x = 0; x < BOARD_WIDTH; x++) {
           board.push({
             id: `block-${idCounter++}`,
             type: COLORS[Math.floor(Math.random() * COLORS.length)],
             x, y
           });
         }
       }
    } while (checkMatches(board).length > 0);
    return board;
}
