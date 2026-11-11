package com.codecool.catgpt.cats.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CatCreateRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 16, message = "Name must be between 3 and 16 characters")
        String name,

        @NotBlank(message = "Breed is required")
        @Size(max = 64, message = "Breed must be at most 64 characters")
        String breed,

        Set<@Size(max = 32) String> temperaments,

        @NotNull(message = "Source metrics are required")
        @Valid SourceMetrics sourceMetrics,

        @Size(max = 2048, message = "Image URL must be at most 2048 characters")
        String image
) {}
