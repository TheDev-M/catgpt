export const ITEM_DROPS = [
    { name: "Water",        icon: "/items/food/water.png" },
    { name: "Dry food",     icon: "/items/food/dryfood.png" },
    { name: "Canned food",  icon: "/items/food/cannedfood.png" },
    { name: "Salmon",       icon: "/items/food/salmon.png" },

    { name: "Wipes",        icon: "/items/hygiene/wipes.png" },
    { name: "Litter",       icon: "/items/hygiene/litter.png" },
    { name: "Hairbrush",    icon: "/items/hygiene/hairbrush.png" },
    { name: "Toothbrush",   icon: "/items/hygiene/toothbrush.png" },

    { name: "Woolball",     icon: "/items/toy/woolball.png" },
    { name: "Mouse plush",  icon: "/items/toy/mouseplush.png" },
    { name: "Teaser wand",  icon: "/items/toy/teaserwand.png" },
    { name: "Laser pointer",icon: "/items/toy/laserpointer.png" }
];

export const ITEM_ICONS = ITEM_DROPS.reduce((acc, item) => {
    acc[item.name] = item.icon;
    return acc;
}, {});
