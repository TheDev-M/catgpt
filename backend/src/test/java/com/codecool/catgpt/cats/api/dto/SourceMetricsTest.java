package com.codecool.catgpt.cats.api.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SourceMetricsTest {

    @Test
    void validMetrics_shouldPassValidation() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            var metrics = new SourceMetrics(3, 2, 1);

            var violations = validator.validate(metrics);

            assertThat(violations).isEmpty();
        }
    }

    @Test
    @SuppressWarnings("ConstantConditions")
    void invalidMetrics_shouldFailValidation() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            var metrics = new SourceMetrics(-1, 6, 10);

            var violations = validator.validate(metrics);

            assertThat(violations).hasSize(3);
        }
    }
}
