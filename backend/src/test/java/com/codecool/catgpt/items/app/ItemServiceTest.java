package com.codecool.catgpt.items.app;

import com.codecool.catgpt.items.domain.*;
import com.codecool.catgpt.items.infra.ItemRepository;
import com.codecool.catgpt.users.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository repository;

    @InjectMocks
    private ItemService service;

    private User user;
    private Item item;

    @BeforeEach
    void setUp() {
        user = new User();
        item = Item.builder()
                .name("Salmon")
                .category(ItemCategory.FOOD)
                .effect(new Effect(StatType.HUNGER, 4))
                .availableAmount(1)
                .owner(user)
                .build();
    }

    @Test
    void getAllForOwner_shouldReturnItems() {
        when(repository.findAllByOwner(user)).thenReturn(List.of(item));

        List<Item> items = service.getAllForOwner(user);

        assertEquals(1, items.size());
        assertEquals("Salmon", items.getFirst().getName());
    }

    @Test
    void create_shouldSaveItem() {
        when(repository.save(item)).thenReturn(item);

        Item saved = service.create(item);

        assertEquals(item, saved);
    }

    @Test
    void catchItemForUser_existingItem_shouldIncreaseAmount() {
        when(repository.findByOwnerAndName(user, "Salmon")).thenReturn(Optional.of(item));

        Item result = service.catchItemForUser("Salmon", user);

        assertEquals(item, result);
        assertEquals(2, result.getAvailableAmount());
    }

    @Test
    void catchItemForUser_unknownItem_shouldCreateFromTemplate() {
        when(repository.findByOwnerAndName(user, "Water")).thenReturn(Optional.empty());
        Item newItem = ItemTemplate.WATER.createOwnedItem(user);
        when(repository.save(any(Item.class))).thenReturn(newItem);

        Item result = service.catchItemForUser("Water", user);

        assertEquals("Water", result.getName());
        assertEquals(ItemCategory.FOOD, result.getCategory());
        assertEquals(1, result.getAvailableAmount());
    }

    @Test
    void catchItemForUser_unknownItem_shouldThrowForInvalidName() {
        when(repository.findByOwnerAndName(user, "Unknown")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.catchItemForUser("Unknown", user));

        assertTrue(ex.getMessage().contains("Unknown item"));
    }

    @Test
    void getOwnedItem_shouldReturnItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(item));

        Item result = service.getOwnedItem(1L, user);

        assertEquals(item, result);
    }

    @Test
    void getOwnedItem_shouldThrowNotFound() {
        when(repository.findById(2L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.getOwnedItem(2L, user));

        assertTrue(ex.getMessage().contains("Item not found"));
    }

    @Test
    void getOwnedItem_shouldThrowForbidden() {
        User otherUser = new User();
        item.setOwner(otherUser);
        when(repository.findById(1L)).thenReturn(Optional.of(item));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.getOwnedItem(1L, user));

        assertTrue(ex.getMessage().contains("does not belong"));
    }
}
