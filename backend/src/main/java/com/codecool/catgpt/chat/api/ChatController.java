package com.codecool.catgpt.chat.api;

import com.codecool.catgpt.chat.api.dto.ChatRequest;
import com.codecool.catgpt.chat.api.dto.ChatResponse;
import com.codecool.catgpt.chat.app.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String reply = chatService.chat(request);
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
