import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, type BlockType, type BlockData } from '../store/gameStore';
import { ASSETS } from '../config/assets';
import { BOARD_WIDTH, BOARD_HEIGHT, checkMatches, applyGravityAndGenerate, generateInitialBoard, removeBlocks } from '../utils/match3Logic';

const getBlockImage = (type: BlockType) => {
  switch (type) {
    case 'RED': return ASSETS.BLOCKS.RED;
    case 'BLUE': return ASSETS.BLOCKS.BLUE;
    case 'YELLOW': return ASSETS.BLOCKS.YELLOW;
    case 'GREEN': return ASSETS.BLOCKS.GREEN;
    default: return '';
  }
};

export const Match3Engine = () => {
  const [board, setBoard] = useState<BlockData[]>([]);
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameState, setGameState] = useState<'PLAYING' | 'CLEAR_STAGE_1' | 'CLEAR_STAGE_2' | 'FAIL'>('PLAYING');
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

  const { setMode, movesRemaining, setMoves, missionTargetColor, missionTargetCount, decrementMissionCount, activeQuestId, addToInventory, setRepairAttempt } = useGameStore();

  useEffect(() => {
    // board.length === 0 체크를 추가하여, 최초 렌더링 시 movesRemaining === 0로 인해 FAIL이 즉시 발동하는 것을 막습니다.
    if (gameState !== 'PLAYING' || isAnimating || board.length === 0) return;

    if (missionTargetCount <= 0) {
      setGameState('CLEAR_STAGE_1');
      if (activeQuestId) setRepairAttempt(activeQuestId, true);
      setTimeout(() => setGameState('CLEAR_STAGE_2'), 1500);
      setTimeout(() => {
        if (activeQuestId) addToInventory(activeQuestId);
        setMode('LOBBY');
      }, 2500);
    } else if (movesRemaining <= 0) {
      setGameState('FAIL');
      if (activeQuestId) setRepairAttempt(activeQuestId, false);
      setTimeout(() => setMode('LOBBY'), 2500);
    }
  }, [missionTargetCount, movesRemaining, isAnimating, gameState, activeQuestId, setMode, addToInventory, board.length, setRepairAttempt]);

  useEffect(() => {
    setBoard(generateInitialBoard());
    setMoves(20);
  }, []);

  const handleDragStart = (_event: any, _info: any, id: string) => {
    if (isAnimating) return;
    setDragStartId(id);
  };

  const handleDragEnd = async (_event: any, info: any, id: string) => {
    if (isAnimating) return;
    setDragStartId(null);
    const dx = info.offset.x;
    const dy = info.offset.y;
    if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;

    setIsAnimating(true);

    const block1 = board.find(b => b.id === id);
    if (!block1) { setIsAnimating(false); return; }

    let targetX = block1.x;
    let targetY = block1.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      targetX += dx > 0 ? 1 : -1;
    } else {
      targetY += dy > 0 ? 1 : -1;
    }

    if (targetX < 0 || targetX >= BOARD_WIDTH || targetY < 0 || targetY >= BOARD_HEIGHT) {
      setIsAnimating(false); return;
    }

    const block2 = board.find(b => b.x === targetX && b.y === targetY);
    if (!block2) { setIsAnimating(false); return; }

    const swappedBoard = board.map(b => {
      if (b.id === block1.id) return { ...b, x: targetX, y: targetY };
      if (b.id === block2.id) return { ...b, x: block1.x, y: block1.y };
      return b;
    });

    const initialMatches = checkMatches(swappedBoard);

    if (initialMatches.length === 0) {
      // 1. 유저가 블록 스와이프: match 없으면 해당 블록 바운스 백 (상태 업데이트를 건너뛰어 자연스럽게 원위치 됨)
      setTimeout(() => setIsAnimating(false), 200);
      return;
    }

    // 2. match가 있다면 스와이프 확정
    setBoard(swappedBoard);
    await new Promise(r => setTimeout(r, 200));

    let currentBoard = [...swappedBoard];
    let currentMatches = initialMatches;
    let totalTargetMatched = 0;

    while (currentMatches.length > 0) {
      const matchCountForTarget = currentBoard.filter(b => currentMatches.includes(b.id) && b.type === missionTargetColor).length;
      totalTargetMatched += matchCountForTarget;

      // 먼저 성사된 블록만 제거
      currentBoard = removeBlocks(currentBoard, currentMatches);
      setBoard([...currentBoard]);
      await new Promise(r => setTimeout(r, 200));

      // 3. 제거된 구역 위에 있는 블록들만 떨어지는 애니메이션
      currentBoard = applyGravityAndGenerate(currentBoard);
      setBoard([...currentBoard]);
      await new Promise(r => setTimeout(r, 400));

      // 4. 다시 서치
      currentMatches = checkMatches(currentBoard);
      if (currentMatches.length > 0) {
        await new Promise(r => setTimeout(r, 100)); // 연쇄 폭발 딜레이
      }
    }

    if (totalTargetMatched > 0) decrementMissionCount(totalTargetMatched);

    // 4. match가 더 이상 없으면 move수 차감
    setMoves(movesRemaining - 1);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col w-full h-full bg-black/75 backdrop-blur-sm text-white p-4 items-center overflow-hidden">
      {/* Top HUD: Moves & Target */}
      <AnimatePresence>
        {gameState === 'PLAYING' && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -500, opacity: 0 }} className="flex w-full justify-between items-stretch mb-3 max-w-sm select-none gap-4 mt-2">
            <div className="flex flex-col items-center justify-center bg-slate-800/80 px-4 py-3 rounded-2xl w-1/3 border-2 border-slate-700 shadow-lg relative z-20">
              <span className="text-sm text-gray-400 mb-1 font-semibold tracking-wide">Moves</span>
              <span className="text-4xl font-black text-white">{(movesRemaining === 0 && isAnimating) ? 1 : movesRemaining}</span>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-800/80 px-4 py-3 rounded-2xl flex-1 border-2 border-slate-700 shadow-lg relative z-20">
              <span className="text-sm text-gray-400 mb-1 font-semibold tracking-wide">Target Mission</span>
              <div className="flex gap-3 items-center mt-1">
                {missionTargetColor && <img src={getBlockImage(missionTargetColor)} className="w-10 h-10 object-contain drop-shadow-md" />}
                <span className="text-4xl font-black text-white">{missionTargetCount}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Middle HUD: Big Reward Display */}
      <motion.div
        layout
        className={gameState === 'PLAYING'
          ? "flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/60 to-slate-800/80 w-full max-w-sm px-4 py-6 rounded-2xl border-2 border-purple-500/50 mb-5 shadow-[0_0_20px_rgba(168,85,247,0.4)] min-h-[300px] relative z-20"
          : "absolute inset-0 my-auto flex flex-col items-center justify-center z-[100] pointer-events-none"}
      >
        {gameState === 'PLAYING' && <span className="text-2xl font-black text-yellow-400 tracking-widest uppercase shadow-black drop-shadow-md mb-4">💎 Clear Reward 💎</span>}

        <motion.img
          layout
          initial={false}
          animate={{
            scale: gameState === 'CLEAR_STAGE_1' ? 1.5 : gameState === 'CLEAR_STAGE_2' ? 0.3 : gameState === 'FAIL' ? 0 : 1,
            y: gameState === 'CLEAR_STAGE_2' ? 400 : 0,
            opacity: gameState === 'CLEAR_STAGE_2' ? 0.5 : gameState === 'FAIL' ? 0 : 1
          }}
          transition={{ duration: gameState === 'CLEAR_STAGE_2' ? 0.8 : (gameState === 'FAIL' ? 0.3 : 0.5), type: "spring", bounce: 0.2 }}
          src={ASSETS.ITEMS[(activeQuestId || 'BED') as keyof typeof ASSETS.ITEMS]}
          alt="Reward Item"
          className="w-48 h-48 object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]"
        />

        {/* MISSION CLEAR & FAIL TEXT */}
        <AnimatePresence>
          {gameState === 'CLEAR_STAGE_1' && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 whitespace-nowrap z-50">
              <h1 className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(202,138,4,0.8)] italic text-center">MISSION<br />CLEAR!</h1>
            </motion.div>
          )}
          {gameState === 'FAIL' && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 whitespace-nowrap z-50">
              <h1 className="text-6xl font-black text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] italic text-center">MISSION<br />FAILED</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {gameState === 'PLAYING' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ y: 800, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm my-auto bg-[#111] rounded-2xl relative flex items-center justify-center p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-4 border-slate-700 overflow-hidden z-20"
            style={{ aspectRatio: '7 / 8' }}
          >
            <div
              className="relative w-full h-full"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
                gap: '6px 6px'
              }}
            >
              <AnimatePresence mode="popLayout">
                {board.map((block) => (
                  <motion.div
                    layout="position"
                    key={block.id}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-full h-full touch-none"
                    style={{
                      gridColumn: block.x + 1,
                      gridRow: block.y + 1,
                      zIndex: dragStartId === block.id ? 50 : 10
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <motion.div
                      initial={{ y: -800, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      drag
                      dragSnapToOrigin
                      onDragStart={(e, info) => handleDragStart(e, info, block.id)}
                      onDragEnd={(e, info) => handleDragEnd(e, info, block.id)}
                      dragConstraints={{ top: -75, left: -75, right: 75, bottom: 75 }}
                      dragElastic={0.05}
                      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      {block.type && (
                        <img
                          src={getBlockImage(block.type)}
                          draggable={false}
                          alt={block.type}
                          className="w-[100%] h-[100%] object-contain pointer-events-none rounded-[10%] drop-shadow-lg scale-110"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'PLAYING' && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 100 }}
            onClick={() => setShowGiveUpConfirm(true)}
            className="mt-8 px-6 py-3 bg-red-600/80 hover:bg-red-600 rounded-full font-bold text-lg shadow-lg relative z-20"
          >
            Give Up (Return to Hotel)
          </motion.button>
        )}
      </AnimatePresence>

      {/* Give Up Confirmation Modal */}
      <AnimatePresence>
        {showGiveUpConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-slate-800 border-2 border-red-500 rounded-2xl p-6 flex flex-col items-center max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.3)] text-center"
            >
              <h2 className="text-3xl font-black text-red-500 mb-3 drop-shadow-md">WARNING</h2>
              <p className="text-lg text-gray-200 mb-6 font-semibold">You will lose the reward<br/>if you give up!</p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowGiveUpConfirm(false)}
                  className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-bold shadow-md transition-colors"
                >
                  BACK TO GAME
                </button>
                <button
                  onClick={() => {
                    if (activeQuestId) setRepairAttempt(activeQuestId, false);
                    setMode('LOBBY');
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-colors"
                >
                  GIVE UP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
