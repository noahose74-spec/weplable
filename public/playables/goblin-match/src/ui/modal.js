import { getRuntimeConfig } from "../integration/weplable-bridge.js";

export const renderModal = (state) => {
  const { game, weplableUi } = state;
  const runtimeConfig = getRuntimeConfig();

  if (weplableUi?.tutorialVisible) {
    return `
      <div class="modal-overlay tutorial-overlay">
        <div class="modal-card tutorial-card">
          <p class="modal-tag">Tutorial</p>
          <h3>${runtimeConfig.projectName}</h3>
          <p>${runtimeConfig.tutorial.copy}</p>
          <div class="tutorial-meta">
            <span>${runtimeConfig.tutorial.stepCount} step(s)</span>
            <span>${runtimeConfig.tutorial.mode}</span>
          </div>
          <button class="control-button" data-action="close-tutorial">Start Playing</button>
        </div>
      </div>
    `;
  }

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
          <p class="end-card-note">${runtimeConfig.endCard.note}</p>
          <div class="modal-actions">
            <button class="control-button" data-action="cta-click">${runtimeConfig.endCard.ctaText}</button>
            <button class="control-button secondary" data-action="restart-game">Play Again</button>
            <button class="control-button secondary" data-action="back-to-select">Change Leader</button>
          </div>
        </div>
      </div>
    `;
  }

  return "";
};
