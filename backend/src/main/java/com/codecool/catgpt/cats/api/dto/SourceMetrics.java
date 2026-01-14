package com.codecool.catgpt.cats.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public record SourceMetrics(
        @Min(0) @Max(5) int energyLevel,
        @Min(0) @Max(5) int grooming,
        @Min(0) @Max(5) int healthIssues
) {}