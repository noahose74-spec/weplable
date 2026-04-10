# Goblin Match

Goblin Match is a browser-based movement match-3 prototype.
The player does not swap tiles directly. Instead, the player moves a selected Leader Goblin one tile in any of 8 directions, the two tiles swap, and then the board resolves with match-3 rules.

## How to Run

This prototype is a static web app with ES modules. No build step is required.

### Option 1: Python

```bash
python -m http.server 8123
```

Then open:

[http://127.0.0.1:8123](http://127.0.0.1:8123)

### Option 2: Any static file server

Serve the repository root and open `index.html`.

## Current Rules

- Choose 1 leader from Red, Blue, Green, Yellow.
- Choose 1 stage difficulty: Easy, Normal, or Hard.
- The 3 non-selected goblins become once-per-stage item buttons.
- Each turn, you can either:
  - drag the leader to exactly 1 adjacent tile in any of 8 directions
  - drag a normal block to swap it with 1 adjacent block in the standard match-3 way
- Leader movement swaps the block under the leader with the target block.
- The full stage board is `18 x 22`, but the visible camera view is `9 x 11`.
- The camera follows the leader and keeps it near the center when possible, but clamps at board edges.
- Normal matches are horizontal or vertical only.
- Matched tiles clear, gravity applies, and cascades continue until stable.
- Normal block matches always resolve and clear matched blocks.
- A Goblin Match happens when the Leader Goblin itself is part of the valid match line using its own color.
- Goblin Matches are stronger than normal matches:
  - the goblin stays on the board
  - the match gets a modestly stronger immediate leader bonus
  - the leader gains a temporary 2-turn buff
- During the Goblin Buff, leader-color matches trigger amplified leader effects:
  - Red: extra area burst
  - Blue: extra row or column clear
  - Green: extra objective damage
  - Yellow: removes extra yellow blocks
- Special blocks:
  - 4 in a line: Rocket
  - 5 in a line: Light Ball
  - T or L: TNT
- Stage goals are difficulty-based:
  - Easy: `4` relics in `24` turns
  - Normal: `6` relics in `20` turns
  - Hard: `8` relics in `16` turns
- Relic items are placed near the center lanes so the early board is readable and contestable.

## Tuneable Values

Main tuning values live in:

- [tuning.js](/D:/Vive/GoblinMatch/src/config/tuning.js)
- [stages.js](/D:/Vive/GoblinMatch/src/data/stages.js)
- [goblins.js](/D:/Vive/GoblinMatch/src/data/goblins.js)

Useful values to tweak:

- board width / height
- starting turns
- obstacle goal / obstacle count
- goblin buff duration / strength
- leader effect radius
- item effect strength
- refill and cascade pacing

## Folder Guide

- `docs/`: product and design documentation
- `public/`: static assets
- `src/config/`: tuneable values and constants
- `src/data/`: goblin definitions and stage data
- `src/core/`: game rules and board logic
- `src/systems/`: rendering, input, and effect orchestration
- `src/ui/`: screen and HUD components
- `src/utils/`: shared helpers
- `src/styles/`: CSS files

## Notes on Images

This prototype uses images from:

- [public/COMPONENTS](/D:/Vive/GoblinMatch/public/COMPONENTS)
- [public/icons](/D:/Vive/GoblinMatch/public/icons)

Some selected assets, especially the four leader portraits, were mapped by filename rather than by visual inspection. If any portrait or UI asset looks wrong in-browser, those should be swapped first.

## Reference

- PRD: [PRD.md](/D:/Vive/GoblinMatch/docs/PRD.md)
