package com.codecool.catgpt.items.domain;

import com.codecool.catgpt.users.domain.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Optional;

@Getter
@RequiredArgsConstructor
public enum ItemTemplate {

    // FOOD
    WATER("Water", ItemCategory.FOOD, "/items/food/water.png", StatType.HUNGER, 1),
    DRY_FOOD("Dry food", ItemCategory.FOOD, "/items/food/dryfood.png", StatType.HUNGER, 2),
    CANNED_FOOD("Canned food", ItemCategory.FOOD, "/items/food/cannedfood.png", StatType.HUNGER, 3),
    SALMON("Salmon", ItemCategory.FOOD, "/items/food/salmon.png", StatType.HUNGER, 4),

    // HYGIENE
    WIPES("Wipes", ItemCategory.HYGIENE, "/items/hygiene/wipes.png", StatType.HEALTH, 1),
    LITTER("Litter", ItemCategory.HYGIENE, "/items/hygiene/litter.png", StatType.HEALTH, 2),
    HAIRBRUSH("Hairbrush", ItemCategory.HYGIENE, "/items/hygiene/hairbrush.png", StatType.HEALTH, 3),
    TOOTHBRUSH("Toothbrush", ItemCategory.HYGIENE, "/items/hygiene/toothbrush.png", StatType.HEALTH, 4),

    // TOYS
    WOOLBALL("Woolball", ItemCategory.TOY, "/items/toy/woolball.png", StatType.MOOD, 1),
    MOUSE_PLUSH("Mouse plush", ItemCategory.TOY, "/items/toy/mouseplush.png", StatType.MOOD, 2),
    TEASER_WAND("Teaser wand", ItemCategory.TOY, "/items/toy/teaserwand.png", StatType.MOOD, 3),
    LASER_POINTER("Laser pointer", ItemCategory.TOY, "/items/toy/laserpointer.png", StatType.MOOD, 4);

    private final String displayName;
    private final ItemCategory category;
    private final String icon;
    private final StatType stat;
    private final int amount;

    public static Optional<ItemTemplate> fromName(String name) {
        if (name == null) return Optional.empty();
        return Arrays.stream(values())
                .filter(t -> t.displayName.equalsIgnoreCase(name))
                .findFirst();
    }

    public Item createOwnedItem(User owner, int initialAmount) {
        return Item.builder()
                .name(displayName)
                .category(category)
                .effect(new Effect(stat, amount))
                .availableAmount(initialAmount)
                .owner(owner)
                .build();
    }

    public Item createOwnedItem(User owner) {
        return createOwnedItem(owner, 1);
    }
}
