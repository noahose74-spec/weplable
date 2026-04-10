import { GOBLINS } from "../data/goblins.js";
import { STAGES } from "../data/stages.js";

const panelImage = "./public/COMPONENTS/Panels_Popups/_0009_Popup_BG.png";
const primaryButton = "./public/COMPONENTS/Buttons/img_btn_g_l.png";

export const renderLeaderSelectScreen = (state) => `
  <section class="screen leader-select-screen">
    <div class="hero-panel" style="background-image:url('${panelImage}')">
      <p class="eyebrow">Playable prototype</p>
      <h1>Goblin Match</h1>
      <p class="hero-copy">
        Pick one Leader Goblin. Each turn, move that leader exactly one tile in 8 directions.
        The moved tiles swap, then the board resolves like a match-3 puzzle.
      </p>
      <p class="hero-note">
        Leader-color matches trigger bonus effects. The other three goblins become once-per-stage items.
      </p>
      <div class="difficulty-panel">
        <h2>Stage Difficulty</h2>
        <div class="difficulty-grid">
          ${STAGES.map(
            (stage) => `
              <button
                class="difficulty-card ${state.selectedStageId === stage.id ? "is-selected" : ""}"
                data-action="select-stage"
                data-stage-id="${stage.id}"
              >
                <strong>${stage.difficulty}</strong>
                <span>${stage.goal.target} relics</span>
                <span>${stage.turns} turns</span>
              </button>
            `,
          ).join("")}
        </div>
      </div>
    </div>
    <div class="leader-grid">
      ${GOBLINS.map(
        (goblin) => `
          <article class="leader-card leader-card-${goblin.color}">
            <div class="leader-portrait-wrap">
              <img class="leader-portrait" src="${goblin.portrait}" alt="${goblin.name}" />
            </div>
            <div class="leader-card-copy">
              <p class="leader-role">${goblin.role}</p>
              <h2>${goblin.name}</h2>
              <p>${goblin.description}</p>
            </div>
            <button
              class="image-button select-button"
              data-action="select-leader"
              data-leader-id="${goblin.id}"
              style="background-image:url('${primaryButton}')"
            >
              Choose ${goblin.name}
            </button>
          </article>
        `,
      ).join("")}
    </div>
  </section>
`;
