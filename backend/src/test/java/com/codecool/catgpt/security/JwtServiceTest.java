package com.codecool.catgpt.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    private static final String SECRET = "test-secret-that-is-at-least-32-chars!!";
    private static final long ONE_HOUR_MS = 3_600_000L;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, ONE_HOUR_MS);
    }

    @Test
    void generateToken_shouldProduceNonBlankToken() {
        String token = jwtService.generateToken("alice");

        assertThat(token).isNotBlank();
    }

    @Test
    void extractUsername_shouldReturnSubject() {
        String token = jwtService.generateToken("alice");

        assertThat(jwtService.extractUsername(token)).isEqualTo("alice");
    }

    @Test
    void isTokenValid_validToken_shouldReturnTrue() {
        String token = jwtService.generateToken("bob");

        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_expiredToken_shouldReturnFalse() {
        JwtService shortLived = new JwtService(SECRET, 1L);
        String token = shortLived.generateToken("bob");

        try { Thread.sleep(10); } catch (InterruptedException ignored) {}

        assertThat(shortLived.isTokenValid(token)).isFalse();
    }

    @Test
    void isTokenValid_garbage_shouldReturnFalse() {
        assertThat(jwtService.isTokenValid("not.a.token")).isFalse();
    }

    @Test
    void isTokenValid_tamperedToken_shouldReturnFalse() {
        String token = jwtService.generateToken("alice");
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";

        assertThat(jwtService.isTokenValid(tampered)).isFalse();
    }

    @Test
    void constructor_shortSecret_shouldThrow() {
        assertThrows(IllegalArgumentException.class, () -> new JwtService("short", ONE_HOUR_MS));
    }
}
