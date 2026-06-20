package com.codecool.catgpt.users.api.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRegisterRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password,
        String description
) {}
