package com.codecool.catgpt.cats.api.dto;

import java.util.Set;

public record CatCreateRequest(
        String name,
        String breed,
        Set<String> temperaments,
        Integer hunger,
        Integer mood,
        Integer health,
        SourceMetrics sourceMetrics,
        String image
) {}
