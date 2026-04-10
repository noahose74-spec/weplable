import { useGameStore } from './store/gameStore';
import { LobbyView } from './components/LobbyView';
import { Match3Engine } from './components/Match3Engine';

function App() {
  const mode = useGameStore((state) => state.mode);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background stays active */}
      {(mode === 'LOBBY' || mode === 'MATCH3') && <LobbyView />}

      {/* In-game Overlay */}
      {mode === 'MATCH3' && (
        <div className="absolute inset-0 z-50 w-full h-full">
          <Match3Engine />
        </div>
      )}

      {mode === 'RESULT' && <div className="absolute inset-0 z-50 bg-black text-white p-4">Result Screen</div>}
    </div>
  );
}

export default App;
