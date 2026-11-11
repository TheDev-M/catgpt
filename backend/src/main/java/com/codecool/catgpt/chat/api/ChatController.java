package com.codecool.catgpt.chat.api;

import com.codecool.catgpt.cats.app.CatService;
import com.codecool.catgpt.chat.api.dto.ChatRequest;
import com.codecool.catgpt.chat.api.dto.ChatResponse;
import com.codecool.catgpt.chat.app.ChatService;
import com.codecool.catgpt.common.RateLimiter;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    /** Each message costs an upstream model call, so the budget is per user, not per IP. */
    private static final int MESSAGES_PER_MINUTE = 15;

    private final ChatService chatService;
    private final CatService cats;
    private final CurrentUser currentUser;
    private final RateLimiter rateLimiter;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        User me = currentUser.get();

        if (!rateLimiter.tryAcquire("chat:" + me.getId(), MESSAGES_PER_MINUTE, Duration.ofMinutes(1))) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many messages at once — let your cat catch its breath. 🐾"
            );
        }

        // Loads through the ownership check, so the persona can only ever be built
        // from a cat this user owns or has borrowed.
        var cat = cats.getForUser(request.catId(), me);

        return ResponseEntity.ok(new ChatResponse(chatService.chat(cat, request.prompt())));
    }
}
