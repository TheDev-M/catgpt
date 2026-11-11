package com.codecool.catgpt.items.api;

import com.codecool.catgpt.common.RateLimiter;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemControllerTest {

    @Mock private ItemService service;
    @Mock private CurrentUser currentUser;
    @Mock private RateLimiter rateLimiter;

    @InjectMocks private ItemController controller;

    private Item sampleItem;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setUsername("alice");
        lenient().when(currentUser.get()).thenReturn(sampleUser);
        lenient().when(rateLimiter.tryAcquire(anyString(), anyInt(), any(Duration.class))).thenReturn(true);

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
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown item: Unknown."));

        var exception = assertThrows(ResponseStatusException.class, () ->
                controller.incrementByName("Unknown")
        );

        assertTrue(exception.getReason().contains("Unknown item"));
    }

    @Test
    void incrementByName_overRateLimit_shouldReject() {
        when(rateLimiter.tryAcquire(anyString(), anyInt(), any(Duration.class))).thenReturn(false);

        var exception = assertThrows(ResponseStatusException.class, () ->
                controller.incrementByName("Salmon")
        );

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, exception.getStatusCode());
        verify(service, never()).catchItemForUser(anyString(), any(User.class));
    }
}
