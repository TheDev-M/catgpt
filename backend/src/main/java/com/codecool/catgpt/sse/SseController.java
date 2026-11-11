package com.codecool.catgpt.sse;

import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/sse")
@RequiredArgsConstructor
public class SseController {

    private final CurrentUser currentUser;
    private final SseService sseService;
    private final SseTicketService tickets;

    /**
     * Exchanges the caller's Bearer token for a short-lived stream ticket.
     * Authenticated through the normal filter chain.
     */
    @PostMapping("/ticket")
    public Map<String, String> issueTicket() {
        return Map.of("ticket", tickets.issue(currentUser.get().getId()));
    }

    /**
     * Opens the event stream. This path is not behind the JWT filter — the ticket
     * in the query string is the credential, and it is single-use and short-lived.
     */
    @GetMapping("/events")
    public SseEmitter subscribe(@RequestParam String ticket) {
        Long userId = tickets.redeem(ticket)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid or expired stream ticket."));

        return sseService.subscribe(userId);
    }
}
