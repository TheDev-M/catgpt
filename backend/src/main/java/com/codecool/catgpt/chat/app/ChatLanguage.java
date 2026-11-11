package com.codecool.catgpt.chat.app;

import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;

/**
 * The languages the UI ships in, used as a fallback hint when a prompt is too
 * short to tell what language it is in.
 * <p>
 * This is deliberately a closed whitelist rather than a free string. The value
 * originates from the client and ends up inside the system prompt, so anything
 * unrecognised is dropped instead of being interpolated — only these fixed
 * display names can ever reach the model.
 */
public enum ChatLanguage {

    ENGLISH("en", "English"),
    HUNGARIAN("hu", "Hungarian"),
    GERMAN("de", "German"),
    SPANISH("es", "Spanish");

    private final String code;
    private final String displayName;

    ChatLanguage(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }

    /**
     * Resolves a BCP-47 tag such as {@code hu}, {@code de-DE} or {@code en_GB}
     * to a known language.
     *
     * @return the matching language, or empty if the tag is absent or unsupported
     */
    public static Optional<ChatLanguage> fromTag(String languageTag) {
        if (languageTag == null || languageTag.isBlank()) {
            return Optional.empty();
        }

        String primarySubtag = languageTag.trim().split("[-_]", 2)[0].toLowerCase(Locale.ROOT);

        return Arrays.stream(values())
                .filter(language -> language.code.equals(primarySubtag))
                .findFirst();
    }
}
