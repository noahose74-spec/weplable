import { create } from 'zustand';

// Types and Enums
export type BlockType = 'RED' | 'BLUE' | 'YELLOW' | 'GREEN' | 'LINE_V' | 'LINE_H' | 'BOMB' | 'COLOR_BOMB' | null;

export interface BlockData {
  id: string; // Unique identifier for React keys
  type: BlockType;
  x: number;
  y: number;
}

export type SceneMode = 'LOBBY' | 'MATCH3' | 'REPAIR' | 'RESULT';

interface GameState {
  // Global Progress
  mode: SceneMode;
  setMode: (m: SceneMode) => void;
  
  // Star System (0 to 5)
  totalStars: number;
  addStar: () => void;
  
  // Quests (4 items)
  questsRemaining: number;
  decrementQuests: () => void;

  // Track the current active quest being played or repaired
  activeQuestId: string | null;
  setActiveQuestId: (id: string | null) => void;
  
  // Inventory (Items successfully won and held)
  inventory: string[];
  addToInventory: (item: string) => void;
  removeFromInventory: (item: string) => void;
  
  // Placed / Repaired Fixtures
  placedItems: string[];
  addToPlacedItems: (item: string) => void;
  
  // Repair targets state
  repairs: {
    [key: string]: { isAttempted: boolean; isSuccess: boolean };
  };
  setRepairAttempt: (questId: string, isSuccess: boolean) => void;

  // Match 3 Engine Board specific variables (temporary state per game)
  movesRemaining: number;
  setMoves: (moves: number) => void;
  missionTargetColor: BlockType;
  missionTargetCount: number;
  setMission: (target: BlockType, count: number) => void;
  decrementMissionCount: (val: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  mode: 'LOBBY',
  setMode: (mode) => set({ mode }),
  
  totalStars: 0,
  addStar: () => set((state) => ({ totalStars: Math.min(5, state.totalStars + 1) })),
  
  questsRemaining: 4,
  decrementQuests: () => set((state) => ({ 
    questsRemaining: Math.max(0, state.questsRemaining - 1) 
  })),

  activeQuestId: null,
  setActiveQuestId: (id) => set({ activeQuestId: id }),
  
  inventory: [],
  addToInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  removeFromInventory: (item) => set((state) => ({
    inventory: state.inventory.filter((i) => i !== item)
  })),

  placedItems: [],
  addToPlacedItems: (item) => set((state) => ({ placedItems: [...state.placedItems, item] })),

  repairs: {
    BED: { isAttempted: false, isSuccess: false },
    SOFA: { isAttempted: false, isSuccess: false },
    GRAMOPHONE: { isAttempted: false, isSuccess: false },
    WINDOW: { isAttempted: false, isSuccess: false },
  },
  setRepairAttempt: (questId, isSuccess) => set((state) => ({
    repairs: {
      ...state.repairs,
      [questId]: { isAttempted: true, isSuccess }
    }
  })),

  movesRemaining: 0,
  setMoves: (moves) => set({ movesRemaining: moves }),
  missionTargetColor: 'RED',
  missionTargetCount: 0,
  setMission: (target, count) => set({ missionTargetColor: target, missionTargetCount: count }),
  decrementMissionCount: (val) => set((state) => ({
    missionTargetCount: Math.max(0, state.missionTargetCount - val)
  })),
}));
