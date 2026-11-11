package com.codecool.catgpt.users.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 64, message = "Username must be between 3 and 64 characters")
        @Pattern(regexp = "^[\\p{L}\\p{N}._-]+$",
                message = "Username may only contain letters, numbers, dots, underscores and hyphens")
        String username,

        // 72 bytes is BCrypt's hard limit — anything beyond it is silently ignored,
        // so it is rejected up front rather than giving a false sense of strength.
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
        String password,

        @Size(max = 512, message = "Description must be at most 512 characters")
        String description
) {}
