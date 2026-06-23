package com.codecool.catgpt.friends.api.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FriendRequestDtoValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_shouldPassWithNoViolations() {
        var req = new FriendRequestDto("alice");
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test
    void blankUsername_shouldFailValidation() {
        var req = new FriendRequestDto("   ");
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("username"));
    }

    @Test
    void nullUsername_shouldFailValidation() {
        var req = new FriendRequestDto(null);
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("username"));
    }
}
