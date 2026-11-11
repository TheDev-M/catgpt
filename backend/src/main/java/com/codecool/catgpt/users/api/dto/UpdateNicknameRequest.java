package com.codecool.catgpt.users.api.dto;

import jakarta.validation.constraints.Size;

public record UpdateNicknameRequest(
        @Size(max = 64, message = "Nickname must be at most 64 characters")
        String nickname
) {}
