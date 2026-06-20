package com.codecool.catgpt.cats.api.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CatRenameRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validName_shouldPassWithNoViolations() {
        assertThat(validator.validate(new CatRenameRequest("Whiskers"))).isEmpty();
    }

    @Test
    void blankName_shouldFailValidation() {
        var violations = validator.validate(new CatRenameRequest("  "));
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("name"));
    }

    @Test
    void emptyName_shouldFailValidation() {
        var violations = validator.validate(new CatRenameRequest(""));
        assertThat(violations).isNotEmpty();
    }
}
