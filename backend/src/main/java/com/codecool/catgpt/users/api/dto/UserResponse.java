package com.codecool.catgpt.users.api.dto;

import com.codecool.catgpt.users.domain.AuthProvider;
import com.codecool.catgpt.users.domain.User;

public record UserResponse(
        Long id,
        String username,
        String nickname,
        AuthProvider authProvider,
        Long selectedCatId
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAuthProvider(),
                user.getSelectedCatId()
        );
    }
}
