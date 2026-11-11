package com.codecool.catgpt.sse;

import com.codecool.catgpt.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
     * <p>
     * A rejected ticket answers 401 with no body on purpose. EventSource sends
     * {@code Accept: text/event-stream}, so returning the usual JSON error here
     * fails content negotiation: the client gets a confusing 406 instead of 401,
     * and the server logs a stack trace for what is a routine expired ticket.
     */
    @GetMapping("/events")
    public ResponseEntity<SseEmitter> subscribe(@RequestParam String ticket) {
        return tickets.redeem(ticket)
                .map(userId -> ResponseEntity.ok(sseService.subscribe(userId)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
