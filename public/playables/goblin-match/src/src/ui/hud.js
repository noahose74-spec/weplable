const hudBackground = "./public/COMPONENTS/Merge_IngameUI/_0011_HUD_bg.png";
const clockIcon = "./public/icons/img_icon_clock.png";
const relicIcon = "./public/icons/img_box_normal.png";
const buffIcon = "./public/COMPONENTS/Merge_IngameUI/_0004_Select02.png";

export const renderHud = (game) => `
  <header class="hud" style="background-image:url('${hudBackground}')">
    <div class="hud-card">
      <img src="${clockIcon}" alt="" />
      <div>
        <span class="hud-label">Turns</span>
        <strong>${game.turnsRemaining}</strong>
      </div>
    </div>
    <div class="hud-card">
      <img src="${relicIcon}" alt="" />
      <div>
        <span class="hud-label">${game.goalState.label}</span>
        <strong>${
          game.goalState.type === "goal-items"
            ? `${game.goalState.target - game.goalState.remaining} / ${game.goalState.target}`
            : `${game.goalState.progress} / ${game.goalState.target}`
        }</strong>
      </div>
    </div>
    <div class="hud-card leader-summary leader-summary-${game.leader.color}">
      <img src="${game.leader.portrait}" alt="${game.leader.name}" />
      <div>
        <span class="hud-label">Leader</span>
        <strong>${game.leader.name}</strong>
      </div>
    </div>
    <div class="hud-card stage-summary">
      <div>
        <span class="hud-label">Stage</span>
        <strong>${game.stage.difficulty}</strong>
      </div>
    </div>
    <div class="hud-card buff-summary ${game.goblinBuffTurns > 0 ? "is-active" : ""}">
      <img src="${buffIcon}" alt="" />
      <div>
        <span class="hud-label">Goblin Buff</span>
        <strong>${game.goblinBuffTurns > 0 ? `${game.goblinBuffTurns} turn(s)` : "Inactive"}</strong>
      </div>
    </div>
    <div class="hud-actions">
      <button class="control-button" data-action="restart-game">Restart</button>
      <button class="control-button secondary" data-action="back-to-select">Change Leader</button>
    </div>
  </header>
`;
