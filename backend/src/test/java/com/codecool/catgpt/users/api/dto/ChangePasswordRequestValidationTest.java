package com.codecool.catgpt.users.api.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ChangePasswordRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid_shouldPassWithNoViolations() {
        var req = new ChangePasswordRequest("oldpass", "newpass123");
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test
    void blankCurrentPassword_shouldFailValidation() {
        var req = new ChangePasswordRequest("  ", "newpass123");
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("currentPassword"));
    }

    @Test
    void blankNewPassword_shouldFailValidation() {
        var req = new ChangePasswordRequest("oldpass", "");
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("newPassword"));
    }

    @Test
    void newPasswordTooShort_shouldFailValidation() {
        var req = new ChangePasswordRequest("oldpass", "abc");
        var violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("newPassword"));
    }

    @Test
    void newPasswordExactlyMinLength_shouldPassValidation() {
        var req = new ChangePasswordRequest("oldpass", "123456");
        assertThat(validator.validate(req)).isEmpty();
    }
}
