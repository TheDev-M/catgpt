package com.codecool.catgpt.friends.app;

import com.codecool.catgpt.friends.api.dto.FriendResponse;
import com.codecool.catgpt.friends.domain.Friendship;
import com.codecool.catgpt.friends.domain.FriendshipRepository;
import com.codecool.catgpt.friends.domain.FriendshipStatus;
import com.codecool.catgpt.sse.SseService;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendshipRepository friendships;
    private final UserRepository users;
    private final SseService sse;

    public List<FriendResponse> getFriends(User me) {
        return friendships.findApprovedFriendships(me).stream()
                .map(f -> FriendResponse.from(f, me))
                .toList();
    }

    public List<FriendResponse> getIncomingRequests(User me) {
        return friendships.findIncomingRequests(me).stream()
                .map(f -> FriendResponse.from(f, me))
                .toList();
    }

    public List<FriendResponse> getOutgoingRequests(User me) {
        return friendships.findOutgoingRequests(me).stream()
                .map(f -> FriendResponse.from(f, me))
                .toList();
    }

    @Transactional
    public FriendResponse sendRequest(User me, String targetUsername) {
        if (me.getUsername().equalsIgnoreCase(targetUsername)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a friend request to yourself.");
        }

        User target = users.findByUsername(targetUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        friendships.findBetween(me, target).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, switch (existing.getStatus()) {
                case PENDING -> "A friend request is already pending.";
                case APPROVED -> "You are already friends.";
                case DECLINED -> "This friend request was declined.";
            });
        });

        Friendship friendship = Friendship.builder()
                .requester(me)
                .receiver(target)
                .build();

        FriendResponse saved = FriendResponse.from(friendships.save(friendship), me);

        // Notify the receiver that they have a new incoming request
        sse.send(target.getId(), "friend-update", "request");

        return saved;
    }

    @Transactional
    public FriendResponse approveRequest(User me, Long friendshipId) {
        Friendship f = getAndValidateReceiver(me, friendshipId);
        if (f.getStatus() != FriendshipStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This request is no longer pending.");
        }
        f.setStatus(FriendshipStatus.APPROVED);
        FriendResponse saved = FriendResponse.from(friendships.save(f), me);

        // Notify the original requester that their request was approved
        sse.send(f.getRequester().getId(), "friend-update", "approved");

        return saved;
    }

    @Transactional
    public void declineRequest(User me, Long friendshipId) {
        Friendship f = getAndValidateReceiver(me, friendshipId);
        if (f.getStatus() != FriendshipStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This request is no longer pending.");
        }
        f.setStatus(FriendshipStatus.DECLINED);
        friendships.save(f);

        // Notify the original requester that their request was declined
        sse.send(f.getRequester().getId(), "friend-update", "declined");
    }

    @Transactional
    public void removeFriend(User me, Long friendshipId) {
        Friendship f = friendships.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friendship not found."));
        boolean involved = f.getRequester().getId().equals(me.getId())
                || f.getReceiver().getId().equals(me.getId());
        if (!involved) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not part of this friendship.");
        }

        // Notify the other party
        Long otherId = f.getRequester().getId().equals(me.getId())
                ? f.getReceiver().getId()
                : f.getRequester().getId();
        friendships.delete(f);
        sse.send(otherId, "friend-update", "removed");
    }

    private Friendship getAndValidateReceiver(User me, Long friendshipId) {
        Friendship f = friendships.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friendship not found."));
        if (!f.getReceiver().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot respond to this request.");
        }
        return f;
    }
}
