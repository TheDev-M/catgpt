package com.codecool.catgpt.chat.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * The cat's persona is built server-side from the stored cat, so the client
 * sends only which cat is being talked to — never its stats or temperament.
 */
public record ChatRequest(
        @NotBlank(message = "Prompt is required")
        @Size(max = 500, message = "Prompt must be at most 500 characters")
        String prompt,

        @NotNull(message = "Cat id is required")
        Long catId,

        /**
         * The UI's current locale (a BCP-47 tag such as "hu" or "de-DE"), used only
         * as a fallback when the prompt itself is too short to identify a language.
         * Optional, and silently ignored if it is not one of the supported locales.
         */
        @Size(max = 16, message = "Language tag must be at most 16 characters")
        String language
) {}
