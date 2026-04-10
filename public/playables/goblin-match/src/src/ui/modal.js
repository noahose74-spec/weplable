export const renderModal = (game, pendingItem) => {
  if (game.phase === "won" || game.phase === "lost") {
    return `
      <div class="modal-overlay">
        <div class="modal-card result-card ${game.phase}">
          <h3>${game.result}</h3>
          <p>
            ${game.phase === "won"
              ? "You destroyed every relic crate on the board."
              : "The turns ran out before all relic crates were destroyed."}
          </p>
          <button class="control-button" data-action="restart-game">Play Again</button>
          <button class="control-button secondary" data-action="back-to-select">Change Leader</button>
        </div>
      </div>
    `;
  }

  return "";
};
