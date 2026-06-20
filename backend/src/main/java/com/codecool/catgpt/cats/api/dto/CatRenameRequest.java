package com.codecool.catgpt.cats.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CatRenameRequest(
        @NotBlank(message = "Name is required") String name
) {}
