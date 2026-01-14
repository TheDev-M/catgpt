package com.codecool.catgpt.items.api;

import com.codecool.catgpt.items.api.dto.ItemCreateRequest;
import com.codecool.catgpt.items.api.dto.ItemResponse;
import com.codecool.catgpt.items.app.ItemService;
import com.codecool.catgpt.items.domain.*;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemControllerTest {

    @Mock
    private ItemService service;

    @Mock
    private CurrentUser currentUser;

    @InjectMocks
    private ItemController controller;

    private Item sampleItem;

    @BeforeEach
    void setUp() {
        User sampleUser = new User();
        lenient().when(currentUser.get()).thenReturn(sampleUser);

        sampleItem = Item.builder()
                .name("Salmon")
                .category(ItemCategory.FOOD)
                .effect(new Effect(StatType.HUNGER, 4))
                .availableAmount(3)
                .owner(sampleUser)
                .build();
    }

    @Test
    void getAll_shouldReturnAllItems() {
        when(service.getAllForOwner(any(User.class))).thenReturn(List.of(sampleItem));

        List<ItemResponse> result = controller.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Salmon", result.getFirst().name());
        assertEquals(ItemCategory.FOOD, result.getFirst().category());
    }

    @Test
    void create_shouldReturnCreatedItem() {
        ItemCreateRequest.EffectRequest effectReq =
                new ItemCreateRequest.EffectRequest(StatType.HUNGER, 4);

        ItemCreateRequest req = new ItemCreateRequest(
                "Salmon",
                ItemCategory.FOOD,
                effectReq,
                3
        );

        when(service.create(any(Item.class))).thenReturn(sampleItem);

        ItemResponse response = controller.create(req);

        assertNotNull(response);
        assertEquals("Salmon", response.name());
        assertEquals(ItemCategory.FOOD, response.category());
        assertEquals(4, response.effect().amount());
    }

    @Test
    void incrementByName_existingItem_shouldIncreaseAmount() {
        when(service.catchItemForUser(eq("Salmon"), any(User.class))).thenReturn(sampleItem);

        ItemResponse response = controller.incrementByName("Salmon");

        assertNotNull(response);
        assertEquals("Salmon", response.name());
        assertEquals(3, response.availableAmount());
    }

    @Test
    void incrementByName_unknownItem_shouldThrow() {
        when(service.catchItemForUser(eq("Unknown"), any(User.class)))
                .thenThrow(new RuntimeException("Unknown item: Unknown"));

        Exception exception = assertThrows(RuntimeException.class, () ->
                controller.incrementByName("Unknown")
        );

        assertTrue(exception.getMessage().contains("Unknown item"));
    }
}
