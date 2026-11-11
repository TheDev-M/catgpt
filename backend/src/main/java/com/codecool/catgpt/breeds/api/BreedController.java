package com.codecool.catgpt.breeds.api;

import com.codecool.catgpt.breeds.api.dto.BreedResponse;
import com.codecool.catgpt.breeds.app.BreedService;
import com.codecool.catgpt.common.RateLimiter;
import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    /** Each call costs an image lookup against TheCatAPI's quota. */
    private static final int CATCHES_PER_MINUTE = 20;

    private final BreedService breedService;
    private final CurrentUser currentUser;
    private final RateLimiter rateLimiter;

    @GetMapping("/random")
    public ResponseEntity<BreedResponse> getRandomBreed() {
        Long userId = currentUser.get().getId();

        if (!rateLimiter.tryAcquire("breed:" + userId, CATCHES_PER_MINUTE, Duration.ofMinutes(1))) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many cats at once — try again in a moment. 🐾"
            );
        }

        return ResponseEntity.ok(breedService.getRandomBreedWithImage());
    }
}
