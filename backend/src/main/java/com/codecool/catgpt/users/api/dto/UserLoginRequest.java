package com.codecool.catgpt.users.api.dto;

public record UserLoginRequest(
        String username,
        String password
) {}

