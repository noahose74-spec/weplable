const assetPath = (path: string) => `./assets/${path}`;

export const RUNTIME_ASSETS = {
  BLOCKS: {
    RED: assetPath('blocks/red.png'),
    BLUE: assetPath('blocks/blue.png'),
    YELLOW: assetPath('blocks/yellow.png'),
    GREEN: assetPath('blocks/green.png'),
  },
  ITEMS: {
    BED: assetPath('items/item_bedding.png'),
    SOFA: assetPath('items/item_bedding.png'),
    GRAMOPHONE: assetPath('items/item_bedding.png'),
    WINDOW: assetPath('items/item_bedding.png'),
  },
  INTERIOR: {
    BACKGROUND: assetPath('interiors/background_repaired.png'),
    FINAL_BACKGROUND: assetPath('interiors/background_repaired.png'),
    BROKEN: {
      BED: assetPath('interiors/broken_bed.png'),
      SOFA: assetPath('interiors/broken_bed.png'),
      GRAMOPHONE: assetPath('interiors/broken_bed.png'),
      WINDOW: assetPath('interiors/broken_bed.png'),
    },
    REPAIRED: {
      BED: assetPath('items/item_bedding.png'),
      SOFA: assetPath('items/item_bedding.png'),
      GRAMOPHONE: assetPath('items/item_bedding.png'),
      WINDOW: assetPath('items/item_bedding.png'),
    },
  },
};
