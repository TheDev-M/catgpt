package com.codecool.catgpt.sse;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Issues short-lived, single-use tickets for opening an SSE stream.
 * <p>
 * {@code EventSource} cannot send an Authorization header, and putting the JWT in
 * the query string would leak a long-lived credential into access logs, proxy logs
 * and browser history. A ticket is opaque, valid for seconds, and dies on first use.
 */
@Service
public class SseTicketService {

    private static final Duration TTL = Duration.ofSeconds(30);
    private static final int TICKET_BYTES = 32;

    private final SecureRandom random = new SecureRandom();
    private final Map<String, Ticket> tickets = new ConcurrentHashMap<>();

    public String issue(Long userId) {
        purgeExpired();

        byte[] bytes = new byte[TICKET_BYTES];
        random.nextBytes(bytes);
        String ticket = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        tickets.put(ticket, new Ticket(userId, Instant.now().plus(TTL)));
        return ticket;
    }

    /**
     * Consumes a ticket, returning the user it was issued to.
     *
     * @return the user id, or empty if the ticket is unknown, already used, or expired
     */
    public Optional<Long> redeem(String ticket) {
        if (ticket == null || ticket.isBlank()) {
            return Optional.empty();
        }

        Ticket redeemed = tickets.remove(ticket);
        if (redeemed == null || redeemed.expiresAt().isBefore(Instant.now())) {
            return Optional.empty();
        }

        return Optional.of(redeemed.userId());
    }

    private void purgeExpired() {
        Instant now = Instant.now();
        tickets.values().removeIf(t -> t.expiresAt().isBefore(now));
    }

    private record Ticket(Long userId, Instant expiresAt) {}
}
