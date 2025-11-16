package com.codecool.catgpt.users.api.dto;

public record UserRegisterRequest(
        String username,
        String password,
        String description
) {}

