package com.codecool.catgpt.common;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleResponseStatus_shouldPassThroughStatusAndMessage() {
        var ex = new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found");

        ResponseEntity<ErrorResponse> response = handler.handleResponseStatus(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(404);
        assertThat(response.getBody().message()).isEqualTo("Cat not found");
        assertThat(response.getBody().errors()).isEmpty();
    }

    @Test
    void handleValidation_shouldReturn400WithFieldErrors() {
        var binding = new BeanPropertyBindingResult(new Object(), "req");
        binding.addError(new FieldError("req", "username", "Username is required"));
        binding.addError(new FieldError("req", "password", "Password is required"));
        var ex = new MethodArgumentNotValidException(null, binding);

        ResponseEntity<ErrorResponse> response = handler.handleValidation(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("Validation failed");
        assertThat(response.getBody().errors())
                .containsExactlyInAnyOrder(
                        "username: Username is required",
                        "password: Password is required"
                );
    }

    @Test
    void handleIllegalArgument_shouldReturn400() {
        var ex = new IllegalArgumentException("Invalid stat: foo");

        ResponseEntity<ErrorResponse> response = handler.handleIllegalArgument(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("Invalid stat: foo");
    }

    @Test
    void handleIllegalState_shouldReturn400() {
        var ex = new IllegalStateException("Item out of stock");

        ResponseEntity<ErrorResponse> response = handler.handleIllegalState(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("Item out of stock");
    }

    @Test
    void handleUnexpected_shouldReturn500WithGenericMessage() {
        var ex = new RuntimeException("DB connection lost");

        ResponseEntity<ErrorResponse> response = handler.handleUnexpected(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(500);
        assertThat(response.getBody().message()).isEqualTo("An unexpected error occurred");
        assertThat(response.getBody().message()).doesNotContain("DB connection lost");
    }
}
