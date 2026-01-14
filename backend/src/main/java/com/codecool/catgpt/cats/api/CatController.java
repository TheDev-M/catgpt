package com.codecool.catgpt.cats.api;

import com.codecool.catgpt.cats.api.dto.CatCreateRequest;
import com.codecool.catgpt.cats.api.dto.CatResponse;
import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.items.domain.StatType;
import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {
    private final CatService cats;
    private final CurrentUser currentUser;

    @GetMapping
    public Iterable<CatResponse> all() {
        return cats.getAllForOwner(currentUser.get()).stream().map(CatResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CatResponse get(@PathVariable Long id) {
        return CatResponse.from(cats.get(id));
    }

    @PostMapping
    public ResponseEntity<CatResponse> create(@RequestBody CatCreateRequest req) {
        var created = cats.create(req, currentUser.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(CatResponse.from(created));
    }

    @PostMapping("/{id}/stats/{stat}/decrement")
    public ResponseEntity<?> decrementStat(@PathVariable Long id, @PathVariable String stat) {

        StatType type;
        try {
            type = StatType.valueOf(stat.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid stat: " + stat)
            );
        }

        var result = cats.decrementStat(id, type, currentUser.get());

        if (result == null) {
            return ResponseEntity.ok(Map.of("status", "released"));
        }

        return ResponseEntity.ok(
                Map.of("status", "ok", "cat", CatResponse.from(result))
        );
    }


    @PostMapping("/{catId}/items/{itemId}")
    public CatResponse use(@PathVariable Long catId, @PathVariable Long itemId) {
        return CatResponse.from(cats.applyItem(catId, itemId, currentUser.get()));
    }


    @PatchMapping("/{id}")
    public CatResponse update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return CatResponse.from(cats.rename(id, body.get("name"), currentUser.get()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        cats.delete(id, currentUser.get());
    }


}
