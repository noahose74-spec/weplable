export const bindInputController = (root, handlers) => {
  let dragSession = null;

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.dataset.action;

    if (action === "select-leader") {
      handlers.onSelectLeader(target.dataset.leaderId);
      return;
    }

    if (action === "select-stage") {
      handlers.onSelectStage(target.dataset.stageId);
      return;
    }

    if (action === "board-cell") {
      handlers.onBoardCellClick({
        x: Number(target.dataset.x),
        y: Number(target.dataset.y),
      });
      return;
    }

    if (action === "use-item") {
      handlers.onUseItem(target.dataset.itemId);
      return;
    }

    if (action === "pick-color") {
      handlers.onPickColor(target.dataset.color);
      return;
    }

    if (action === "restart-game") {
      handlers.onRestart();
      return;
    }

    if (action === "close-tutorial") {
      handlers.onCloseTutorial?.();
      return;
    }

    if (action === "cta-click") {
      handlers.onCtaClick?.();
      return;
    }

    if (action === "back-to-select") {
      handlers.onBackToSelect();
    }
  });

  root.addEventListener("pointerdown", (event) => {
    const target = event.target.closest('[data-action="board-cell"]');
    if (!target) {
      return;
    }

    dragSession = {
      pointerId: event.pointerId,
    };

    target.setPointerCapture?.(event.pointerId);
    const pointer = {
      x: event.clientX,
      y: event.clientY,
    };

    if (target.dataset.leaderCell === "true") {
      handlers.onLeaderDragStart(pointer);
    } else if (target.dataset.blockCell === "true") {
      handlers.onBlockDragStart(
        {
          x: Number(target.dataset.x),
          y: Number(target.dataset.y),
        },
        pointer,
      );
    } else {
      dragSession = null;
      return;
    }

    event.preventDefault();
  });

  root.addEventListener("pointermove", (event) => {
    if (!dragSession || dragSession.pointerId !== event.pointerId) {
      return;
    }

    handlers.onLeaderDragMove(
      null,
      {
        x: event.clientX,
        y: event.clientY,
      },
    );
  });

  const finishDrag = (event, canceled = false) => {
    if (!dragSession || dragSession.pointerId !== event.pointerId) {
      return;
    }

    if (canceled) {
      handlers.onLeaderDragCancel();
      dragSession = null;
      return;
    }

    handlers.onAnyDragEnd(null);
    dragSession = null;
  };

  root.addEventListener("pointerup", (event) => finishDrag(event, false));
  root.addEventListener("pointercancel", (event) => finishDrag(event, true));
};
