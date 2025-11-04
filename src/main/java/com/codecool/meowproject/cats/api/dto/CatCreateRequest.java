package com.codecool.meowproject.cats.api.dto;

import java.util.List;

public record CatCreateRequest(
        String name,
        String breed,
        List<String> temperaments,
        Integer hunger,
        Integer mood,
        Integer health,
        String image
) {}
