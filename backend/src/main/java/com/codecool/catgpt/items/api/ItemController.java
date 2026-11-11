package com.codecool.catgpt.items.api;

import com.codecool.catgpt.items.api.dto.ItemResponse;
import com.codecool.catgpt.items.app.ItemService;
import com.codecool.catgpt.common.RateLimiter;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.List;

/**
 * Items are only ever created from the server-side {@code ItemTemplate} catalogue —
 * there is deliberately no endpoint that lets a client choose an item's effect or
 * quantity, since that would make the whole economy client-authoritative.
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    /** Items fall roughly every 15–25s, so this is generous for play but closes the curl loop. */
    private static final int PICKUPS_PER_MINUTE = 10;

    private final ItemService service;
    private final CurrentUser currentUser;
    private final RateLimiter rateLimiter;

    @GetMapping
    public List<ItemResponse> getAll() {
        return service.getAllForOwner(currentUser.get()).stream()
                .map(ItemResponse::from)
                .toList();
    }

    @PostMapping("/{name}/increment")
    public ItemResponse incrementByName(@PathVariable String name) {
        User me = currentUser.get();

        if (!rateLimiter.tryAcquire("item-pickup:" + me.getId(), PICKUPS_PER_MINUTE, Duration.ofMinutes(1))) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Slow down — the sky can only drop so many treats. 🐾"
            );
        }

        return ItemResponse.from(service.catchItemForUser(name, me));
    }
}
