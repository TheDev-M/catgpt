package com.codecool.catgpt.users.api.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserRegisterRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_shouldPassWithNoViolations() {
        var req = new UserRegisterRequest("alice", "secret123", null);
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test
    void blankUsername_shouldFailValidation() {
        var req = new UserRegisterRequest("  ", "secret", null);
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("username"));
    }

    @Test
    void blankPassword_shouldFailValidation() {
        var req = new UserRegisterRequest("alice", "", null);
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("password"));
    }

    @Test
    void bothBlank_shouldHaveTwoViolations() {
        var req = new UserRegisterRequest("", "", null);
        assertThat(validator.validate(req)).hasSize(2);
    }
}
