package com.codecool.catgpt.friends.api.dto;

import com.codecool.catgpt.friends.domain.Friendship;
import com.codecool.catgpt.friends.domain.FriendshipStatus;
import com.codecool.catgpt.users.domain.User;

public record FriendResponse(
        Long friendshipId,
        Long userId,
        String username,
        String nickname,
        FriendshipStatus status,
        boolean isRequester
) {
    public static FriendResponse from(Friendship f, User me) {
        boolean iAmRequester = f.getRequester().getId().equals(me.getId());
        User other = iAmRequester ? f.getReceiver() : f.getRequester();
        return new FriendResponse(
                f.getId(),
                other.getId(),
                other.getUsername(),
                other.getNickname(),
                f.getStatus(),
                iAmRequester
        );
    }
}
