import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { RUNTIME_ASSETS as ASSETS } from '../config/runtimeAssets';

const FIXTURES = [
  { id: 'BED', color: 'RED', label: 'BED', btnBg: 'bg-red-600', hoverBg: 'hover:bg-red-500', shadow: 'shadow-[0_0_15px_#dc2626]', hitbox: 'right-[10%] top-[30%] w-[35%] h-[30%]', imgPosition: 'top-0 right-0 w-[55%] h-auto object-contain' },
  { id: 'GRAMOPHONE', color: 'GREEN', label: 'TABLE', btnBg: 'bg-green-600', hoverBg: 'hover:bg-green-500', shadow: 'shadow-[0_0_15px_#16a34a]', hitbox: 'left-[10%] bottom-[15%] w-[30%] h-[25%]', imgPosition: 'inset-0 w-full h-full object-contain' },
  { id: 'WINDOW', color: 'BLUE', label: 'WINDOW', btnBg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', shadow: 'shadow-[0_0_15px_#2563eb]', hitbox: 'left-[15%] top-[20%] w-[35%] h-[30%]', imgPosition: 'inset-0 w-full h-full object-contain' },
  { id: 'SOFA', color: 'YELLOW', label: 'SOFA', btnBg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-500', shadow: 'shadow-[0_0_15px_#ca8a04]', hitbox: 'right-[10%] bottom-[20%] w-[35%] h-[25%]', imgPosition: 'inset-0 w-full h-full object-contain' },
];

export const LobbyView = () => {
  const { setMode, setActiveQuestId, setMission, inventory, repairs, removeFromInventory, addToPlacedItems, placedItems } = useGameStore();
  const [dragHover, setDragHover] = useState<string | null>(null);

  const handleQuestClick = (questId: string, color: any, count: number) => {
    setActiveQuestId(questId);
    setMission(color, count);
    setMode('MATCH3');
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragHover(null);
    const draggedItemId = e.dataTransfer.getData('itemId');

    if (draggedItemId === targetId) {
      removeFromInventory(targetId);
      addToPlacedItems(targetId);
    }
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragHover(targetId);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1c1c1c] text-white relative overflow-hidden">
      {/* Main Play Area */}
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-0">
        <div className="relative w-full max-h-full aspect-[9/16] flex-shrink-0">
          {/* Base Background: Fully Repaired Hotel */}
          <img src={ASSETS.INTERIOR.FINAL_BACKGROUND} alt="Hotel Background Replaired Base" className="absolute inset-0 w-full h-full object-contain" />

          {FIXTURES.map((fixture) => (
            <React.Fragment key={fixture.id}>
              {/* FIXTURE VISUAL LAYERS (Broken Overlay Only) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <AnimatePresence>
                  {!placedItems.includes(fixture.id) && (
                    <motion.img
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      src={ASSETS.INTERIOR.BROKEN[fixture.id as keyof typeof ASSETS.INTERIOR.BROKEN]}
                      alt={`Broken ${fixture.label}`}
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-300 ${dragHover === fixture.id ? 'scale-[1.02] brightness-125 saturate-150 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}`}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* FIXTURE HITBOX & BUTTON */}
              <div
                className={`absolute ${fixture.hitbox} z-20`}
                onDragOver={(e) => handleDragOver(e, fixture.id)}
                onDragLeave={() => setDragHover(null)}
                onDrop={(e) => handleDrop(e, fixture.id)}
              >
                {dragHover === fixture.id && (
                  <div className="absolute inset-0 border-4 border-yellow-400 rounded-xl bg-yellow-400/20 animate-pulse pointer-events-none" />
                )}

                {!repairs[fixture.id].isAttempted && (
                  <button
                    onClick={() => handleQuestClick(fixture.id, fixture.color, 3)}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${fixture.btnBg} ${fixture.hoverBg} text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm ${fixture.shadow}`}
                  >
                    {fixture.label}
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Inventory Bar */}
      <div className="h-24 bg-black/50 border-t border-gray-700 p-2 flex gap-4 overflow-x-auto items-center justify-center relative z-30 flex-shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        {inventory.length === 0 ? (
          <span className="text-gray-500 text-sm">Inventory Empty</span>
        ) : (
          inventory.map((itemId, idx) => (
            <motion.img
              key={idx + itemId}
              draggable
              onDragStart={(e: any) => e.dataTransfer.setData('itemId', itemId)}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' }}
              src={ASSETS.ITEMS[itemId as keyof typeof ASSETS.ITEMS]}
              className="w-16 h-16 object-contain drop-shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            />
          ))
        )}
      </div>
    </div>
  );
};
