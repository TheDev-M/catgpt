package com.codecool.meowproject.cats.api;

import com.codecool.meowproject.cats.api.dto.CatCreateRequest;
import com.codecool.meowproject.cats.api.dto.CatResponse;
import com.codecool.meowproject.cats.app.CatService;
import com.codecool.meowproject.cats.domain.Cat;
import com.codecool.meowproject.cats.domain.Stats;
import com.codecool.meowproject.cats.domain.Temperament;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {
    private final CatService cats;

    @GetMapping
    public Iterable<CatResponse> all() {
        return cats.getAll().stream().map(CatResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CatResponse get(@PathVariable Long id) {
        return CatResponse.from(cats.get(id));
    }

    @PostMapping
    public ResponseEntity<CatResponse> create(@RequestBody CatCreateRequest req) {
        var stats = Stats.builder()
                .hunger(Optional.ofNullable(req.hunger()).orElse(7))
                .mood(Optional.ofNullable(req.mood()).orElse(7))
                .health(Optional.ofNullable(req.health()).orElse(7))
                .build();

        var cat = Cat.builder()
                .name(req.name())
                .breed(req.breed())
                .temperaments(req.temperaments() == null ? new LinkedHashSet<>() :
                        req.temperaments().stream()
                                .map(Temperament::fromString)
                                .collect(Collectors.toCollection(LinkedHashSet::new)))
                .stats(stats)
                .image(req.image())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(CatResponse.from(cats.create(cat)));
    }

    @PatchMapping("/{id}")
    public CatResponse rename(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return CatResponse.from(cats.rename(id, body.get("name")));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        cats.delete(id);
    }

    @PatchMapping("/{catId}/use-item/{itemId}")
    public CatResponse use(@PathVariable Long catId, @PathVariable Long itemId) {
        return CatResponse.from(cats.applyItem(catId, itemId));
    }
}
