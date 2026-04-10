import { getRuntimeConfig } from "../integration/weplable-bridge.js";
import { renderHud } from "./hud.js";
import { renderBoard } from "../systems/render-board.js";
import { renderItemBar } from "./item-bar.js";
import { renderModal } from "./modal.js";

export const renderGameScreen = (state) => {
  const runtimeConfig = getRuntimeConfig();

  return `
  <section class="screen game-screen">
    <div class="runtime-meta-bar">
      <span>${runtimeConfig.projectName}</span>
      <span>${runtimeConfig.exportPreset}</span>
      <span>${runtimeConfig.orientation}</span>
    </div>
    ${renderHud(state.game)}
    <main class="game-layout">
      <section class="board-panel">
        ${renderBoard(state.game, state.pendingItem, state.dragState, state.moveAnimation, state.itemAnimation)}
      </section>
      <aside class="side-panel">
        <section class="rules-panel">
          <h3>Goal and Tutorial</h3>
          <p class="rules-summary">${runtimeConfig.goalLabel}</p>
          <ul>
            <li>Drag the leader to move it 1 tile, or drag a normal block to swap it with an adjacent block.</li>
            <li>After the move or swap, the board resolves automatically.</li>
            <li>Normal block matches always work. Goblin Matches happen when the leader is inside the match line.</li>
            <li>${runtimeConfig.tutorial.copy}</li>
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
    ${renderModal(state)}
  </section>
`;
};
