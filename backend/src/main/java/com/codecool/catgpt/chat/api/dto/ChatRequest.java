package com.codecool.catgpt.chat.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public record ChatRequest(
    @NotBlank String prompt,
    @NotNull CatContext cat
) {
    public record CatContext(
        String name,
        String breed,
        List<String> temperaments,
        Map<String, Integer> stats
    ) {}
}
