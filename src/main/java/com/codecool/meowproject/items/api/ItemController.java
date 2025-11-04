package com.codecool.meowproject.items.api;

import com.codecool.meowproject.items.api.dto.*;
import com.codecool.meowproject.items.app.ItemService;
import com.codecool.meowproject.items.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService items;

    @GetMapping
    public List<ItemResponse> all() {
        return items.getAll().stream().map(ItemResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<ItemResponse> create(@RequestBody ItemCreateRequest req) {
        var item = Item.builder()
                .name(req.name())
                .category(req.category())
                .icon(req.icon())
                .effect(Effect.builder().stat(req.stat()).amount(req.amount()).build())
                .availableAmount(req.availableAmount())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ItemResponse.from(items.create(item)));
    }
}
