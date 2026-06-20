package com.codecool.catgpt.items.domain;

import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ItemTemplateTest {

    @Test
    void fromName_knownName_shouldReturnTemplate() {
        Optional<ItemTemplate> result = ItemTemplate.fromName("Salmon");
        assertThat(result).contains(ItemTemplate.SALMON);
    }

    @Test
    void fromName_caseInsensitive_shouldMatch() {
        assertThat(ItemTemplate.fromName("SALMON")).contains(ItemTemplate.SALMON);
        assertThat(ItemTemplate.fromName("salmon")).contains(ItemTemplate.SALMON);
    }

    @Test
    void fromName_unknownName_shouldReturnEmpty() {
        assertThat(ItemTemplate.fromName("mystery meat")).isEmpty();
    }

    @Test
    void fromName_null_shouldReturnEmpty() {
        assertThat(ItemTemplate.fromName(null)).isEmpty();
    }

    @ParameterizedTest
    @EnumSource(ItemTemplate.class)
    void fromName_allTemplates_shouldBeFoundByDisplayName(ItemTemplate template) {
        Optional<ItemTemplate> result = ItemTemplate.fromName(template.getDisplayName());
        assertThat(result).contains(template);
    }

    @Test
    void createOwnedItem_shouldProduceCorrectItem() {
        User owner = new User();
        Item item = ItemTemplate.SALMON.createOwnedItem(owner);

        assertThat(item.getName()).isEqualTo("Salmon");
        assertThat(item.getCategory()).isEqualTo(ItemCategory.FOOD);
        assertThat(item.getEffect().getStat()).isEqualTo(StatType.HUNGER);
        assertThat(item.getEffect().getAmount()).isEqualTo(4);
        assertThat(item.getAvailableAmount()).isEqualTo(1);
        assertThat(item.getOwner()).isSameAs(owner);
    }

    @Test
    void createOwnedItem_withAmount_shouldSetAmount() {
        User owner = new User();
        Item item = ItemTemplate.LASER_POINTER.createOwnedItem(owner, 5);

        assertThat(item.getAvailableAmount()).isEqualTo(5);
    }
}
