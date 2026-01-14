package com.codecool.catgpt.items.api;

import com.codecool.catgpt.items.api.dto.*;
import com.codecool.catgpt.items.app.ItemService;
import com.codecool.catgpt.items.domain.*;
import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService service;
    private final CurrentUser currentUser;

    @GetMapping
    public List<ItemResponse> getAll() {
        return service.getAllForOwner(currentUser.get()).stream()
                .map(ItemResponse::from)
                .toList();
    }

    @PostMapping
    public ItemResponse create(@RequestBody ItemCreateRequest req) {
        var item = Item.builder()
                .name(req.name())
                .category(req.category())
                .effect(new Effect(req.effect().stat(), req.effect().amount()))
                .availableAmount(req.availableAmount())
                .owner(currentUser.get())
                .build();

        return ItemResponse.from(service.create(item));
    }

    @PostMapping("/{name}/increment")
    public ItemResponse incrementByName(@PathVariable String name) {
        return ItemResponse.from(service.catchItemForUser(name, currentUser.get()));
    }
}
