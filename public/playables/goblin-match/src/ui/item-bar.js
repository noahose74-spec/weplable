import { getGoblinById } from "../core/game-state.js";

const ITEM_BUTTONS = {
  red: "./public/COMPONENTS/Buttons/img_btn_r.png",
  blue: "./public/COMPONENTS/Buttons/img_btn_b.png",
  green: "./public/COMPONENTS/Buttons/img_btn_g_s.png",
  yellow: "./public/COMPONENTS/Buttons/img_btn_y_02_m.png",
};

export const renderItemBar = (game, pendingItem) => `
  <section class="item-bar">
    <div class="item-bar-header">
      <h3>Goblin Items</h3>
      <p>Click an item, place that goblin on a tile, then watch it activate. Each item can be used once and costs no turn.</p>
    </div>
    <div class="item-list">
      ${game.itemState
        .map((itemState) => {
          const goblin = getGoblinById(itemState.id);
          const active = pendingItem?.id === goblin.id;

          return `
            <button
              class="item-button ${itemState.used ? "is-used" : ""} ${active ? "is-active" : ""}"
              data-action="use-item"
              data-item-id="${goblin.id}"
              style="background-image:url('${ITEM_BUTTONS[goblin.id]}')"
              ${itemState.used ? "disabled" : ""}
            >
              <img src="${goblin.portrait}" alt="${goblin.name}" />
              <span class="item-copy">
                <strong>${goblin.name}</strong>
                <span>${goblin.itemLabel}</span>
              </span>
              <span class="item-state">${itemState.used ? "Used" : active ? "Selected" : "Ready"}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  </section>
`;
