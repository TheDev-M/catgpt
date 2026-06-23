package com.codecool.catgpt.friends.api;

import com.codecool.catgpt.friends.api.dto.FriendRequestDto;
import com.codecool.catgpt.friends.api.dto.FriendResponse;
import com.codecool.catgpt.friends.app.FriendService;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final CurrentUser currentUser;
    private final FriendService friendService;

    @GetMapping
    public List<FriendResponse> getFriends() {
        User me = currentUser.get();
        return friendService.getFriends(me);
    }

    @GetMapping("/requests/incoming")
    public List<FriendResponse> getIncomingRequests() {
        User me = currentUser.get();
        return friendService.getIncomingRequests(me);
    }

    @GetMapping("/requests/outgoing")
    public List<FriendResponse> getOutgoingRequests() {
        User me = currentUser.get();
        return friendService.getOutgoingRequests(me);
    }

    @PostMapping("/request")
    public ResponseEntity<FriendResponse> sendRequest(@Valid @RequestBody FriendRequestDto req) {
        User me = currentUser.get();
        FriendResponse response = friendService.sendRequest(me, req.username());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/approve")
    public FriendResponse approveRequest(@PathVariable Long id) {
        User me = currentUser.get();
        return friendService.approveRequest(me, id);
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<Void> declineRequest(@PathVariable Long id) {
        User me = currentUser.get();
        friendService.declineRequest(me, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFriend(@PathVariable Long id) {
        User me = currentUser.get();
        friendService.removeFriend(me, id);
        return ResponseEntity.noContent().build();
    }
}
