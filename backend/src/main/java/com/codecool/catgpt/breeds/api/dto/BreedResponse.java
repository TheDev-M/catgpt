package com.codecool.catgpt.breeds.api.dto;

public record BreedResponse(
    String id,
    String name,
    String description,
    String temperament,
    Integer energyLevel,
    Integer grooming,
    Integer healthIssues,
    String image
) {}
