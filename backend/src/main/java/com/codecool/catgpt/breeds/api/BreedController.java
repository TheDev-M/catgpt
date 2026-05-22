package com.codecool.catgpt.breeds.api;

import com.codecool.catgpt.breeds.api.dto.BreedResponse;
import com.codecool.catgpt.breeds.app.BreedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    private final BreedService breedService;

    @GetMapping("/random")
    public ResponseEntity<BreedResponse> getRandomBreed() {
        return ResponseEntity.ok(breedService.getRandomBreedWithImage());
    }
}
