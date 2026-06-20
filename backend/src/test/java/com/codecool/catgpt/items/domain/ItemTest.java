package com.codecool.catgpt.items.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ItemTest {

    private Item buildItem(int amount) {
        return Item.builder()
                .name("Salmon")
                .category(ItemCategory.FOOD)
                .effect(new Effect(StatType.HUNGER, 4))
                .availableAmount(amount)
                .build();
    }

    @Test
    void increaseOne_shouldIncrementByOne() {
        Item item = buildItem(2);
        item.increaseOne();
        assertThat(item.getAvailableAmount()).isEqualTo(3);
    }

    @Test
    void consumeOne_shouldDecrementByOne() {
        Item item = buildItem(3);
        item.consumeOne();
        assertThat(item.getAvailableAmount()).isEqualTo(2);
    }

    @Test
    void consumeOne_atZero_shouldThrowIllegalState() {
        Item item = buildItem(0);
        assertThatThrownBy(item::consumeOne)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("out of stock");
    }

    @Test
    void consumeOne_lastItem_shouldReachZero() {
        Item item = buildItem(1);
        item.consumeOne();
        assertThat(item.getAvailableAmount()).isZero();
    }
}
