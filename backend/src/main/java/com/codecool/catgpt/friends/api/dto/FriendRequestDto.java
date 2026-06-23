package com.codecool.catgpt.friends.api.dto;

import jakarta.validation.constraints.NotBlank;

public record FriendRequestDto(@NotBlank(message = "Username is required.") String username) {}
