package com.codecool.catgpt.sse;

import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sse")
@RequiredArgsConstructor
public class SseController {

    private final CurrentUser currentUser;
    private final SseService sseService;

    @GetMapping("/events")
    public SseEmitter subscribe() {
        Long userId = currentUser.get().getId();
        return sseService.subscribe(userId);
    }
}
