export const ITEM_DROPS = [
  { id: 1, name: "Water", icon: "/items/food/water.png" },
  { id: 2, name: "Dry food", icon: "/items/food/dryfood.png" },
  { id: 3, name: "Canned food", icon: "/items/food/cannedfood.png" },
  { id: 4, name: "Salmon", icon: "/items/food/salmon.png" },

  { id: 5, name: "Wipes", icon: "/items/hygiene/wipes.png" },
  { id: 6, name: "Litter", icon: "/items/hygiene/litter.png" },
  { id: 7, name: "Hairbrush", icon: "/items/hygiene/hairbrush.png" },
  { id: 8, name: "Toothbrush", icon: "/items/hygiene/toothbrush.png" },

  { id: 9, name: "Woolball", icon: "/items/toy/woolball.png" },
  { id: 10, name: "Mouse plush", icon: "/items/toy/mouseplush.png" },
  { id: 11, name: "Teaser wand", icon: "/items/toy/teaserwand.png" },
  { id: 12, name: "Laser pointer", icon: "/items/toy/laserpointer.png" }
];

export const ITEM_ICONS = ITEM_DROPS.reduce((acc, item) => {
  acc[item.name] = item.icon;
  return acc;
}, {});
