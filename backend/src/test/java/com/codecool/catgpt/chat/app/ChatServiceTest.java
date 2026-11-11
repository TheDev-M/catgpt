package com.codecool.catgpt.chat.app;

import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ChatServiceTest {

    private static ChatService serviceFor(String model) {
        return new ChatService("test-key", "https://example.invalid/chat", model, 20);
    }

    private static Cat cat(int hunger, int mood) {
        return Cat.builder()
                .name("Luna")
                .breed("Siamese")
                .temperaments(Set.of("Playful"))
                .stats(new Stats(hunger, mood, 7))
                .defaultCat(false)
                .build();
    }

    // --- reasoning parameters ---
    // Groq rejects reasoning_format on the GPT-OSS models and rejects
    // include_reasoning elsewhere, so the wrong one is a 400 at runtime.

    @Test
    void gptOssModels_useIncludeReasoning_notReasoningFormat() {
        var body = serviceFor("openai/gpt-oss-120b").buildRequestBody(cat(5, 5), "hello");

        assertThat(body).containsEntry("include_reasoning", false);
        assertThat(body).doesNotContainKey("reasoning_format");
    }

    @Test
    void gptOssModels_keepReasoningEffortLow() {
        var body = serviceFor("openai/gpt-oss-20b").buildRequestBody(cat(5, 5), "hello");

        assertThat(body).containsEntry("reasoning_effort", "low");
    }

    @Test
    void nonGptOssModels_useReasoningFormatHidden() {
        var body = serviceFor("qwen/qwen3.8-27b").buildRequestBody(cat(5, 5), "hello");

        assertThat(body).containsEntry("reasoning_format", "hidden");
        assertThat(body).doesNotContainKey("include_reasoning");
        assertThat(body).doesNotContainKey("reasoning_effort");
    }

    // --- request shape ---

    @Test
    void sendsTheConfiguredModel() {
        var body = serviceFor("openai/gpt-oss-120b").buildRequestBody(cat(5, 5), "hello");

        assertThat(body).containsEntry("model", "openai/gpt-oss-120b");
    }

    @Test
    void sendsASystemPromptThenTheUserPrompt() {
        var body = serviceFor("openai/gpt-oss-120b").buildRequestBody(cat(5, 5), "who are you?");

        @SuppressWarnings("unchecked")
        var messages = (List<Map<String, String>>) body.get("messages");

        assertThat(messages).hasSize(2);
        assertThat(messages.get(0)).containsEntry("role", "system");
        assertThat(messages.get(1)).containsEntry("role", "user");
        assertThat(messages.get(1)).containsEntry("content", "who are you?");
    }

    // --- persona is built from the stored cat, not the client ---

    @Test
    void systemPromptCarriesTheCatsIdentityAndStats() {
        var body = serviceFor("openai/gpt-oss-120b").buildRequestBody(cat(1, 9), "hi");

        String systemPrompt = systemPromptOf(body);

        assertThat(systemPrompt).contains("Luna");
        assertThat(systemPrompt).contains("Siamese");
        assertThat(systemPrompt).contains("Playful");
        assertThat(systemPrompt).contains("1/10 (starving)");
        assertThat(systemPrompt).contains("9/10 (extra affectionate)");
    }

    @Test
    void systemPromptDescribesAGrumpyHungryCat() {
        String systemPrompt = systemPromptOf(
                serviceFor("openai/gpt-oss-120b").buildRequestBody(cat(3, 2), "hi"));

        assertThat(systemPrompt).contains("3/10 (quite hungry)");
        assertThat(systemPrompt).contains("2/10 (grumpy)");
    }

    @Test
    void handlesACatWithNoTemperaments() {
        var bald = Cat.builder()
                .name("Ghost")
                .breed("Sphynx")
                .temperaments(Set.of())
                .stats(new Stats(5, 5, 5))
                .defaultCat(false)
                .build();

        String systemPrompt = systemPromptOf(
                serviceFor("openai/gpt-oss-120b").buildRequestBody(bald, "hi"));

        assertThat(systemPrompt).contains("unknown temperament");
    }

    private static String systemPromptOf(Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        var messages = (List<Map<String, String>>) body.get("messages");
        return messages.get(0).get("content");
    }
}
