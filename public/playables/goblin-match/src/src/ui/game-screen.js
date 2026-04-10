import { renderHud } from "./hud.js";
import { renderBoard } from "../systems/render-board.js";
import { renderItemBar } from "./item-bar.js";
import { renderModal } from "./modal.js";

export const renderGameScreen = (state) => `
  <section class="screen game-screen">
    ${renderHud(state.game)}
    <main class="game-layout">
      <section class="board-panel">
        ${renderBoard(state.game, state.pendingItem, state.dragState, state.moveAnimation, state.itemAnimation)}
      </section>
      <aside class="side-panel">
        <section class="rules-panel">
          <h3>How this prototype works</h3>
          <ul>
            <li>Drag the leader to move it 1 tile, or drag a normal block to swap it with an adjacent block.</li>
            <li>After the move or swap, the board resolves automatically.</li>
            <li>Normal block matches always work. Goblin Matches happen when the leader is inside the match line.</li>
            <li>Goblin Matches grant a modest stronger effect now and a 2-turn buff for later turns.</li>
            <li>Goblin items are placed on a tile, then activate without consuming turns.</li>
          </ul>
        </section>
        <section class="log-panel">
          <h3>Battle Log</h3>
          <div class="log-list">
            ${state.logs.map((entry) => `<p>${entry}</p>`).join("")}
          </div>
        </section>
      </aside>
    </main>
    ${renderItemBar(state.game, state.pendingItem)}
    ${renderModal(state.game, state.pendingItem)}
  </section>
`;
