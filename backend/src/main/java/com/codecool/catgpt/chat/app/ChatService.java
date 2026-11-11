package com.codecool.catgpt.chat.app;

import com.codecool.catgpt.cats.domain.Cat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class ChatService {

    /** Returned when the model is unreachable, so an upstream outage reads as a sleepy cat. */
    private static final String FALLBACK_REPLY = "Zzz… 💤";

    /**
     * Production-tier model. Groq's preview tier is explicitly "evaluation only",
     * and preview models are the ones that get retired — which is how the previous
     * default (qwen/qwen3.6-27b, shut down 2026-09-14) ended up broken.
     */
    private static final String DEFAULT_MODEL = "openai/gpt-oss-120b";

    private final RestClient restClient;
    private final String groqApiKey;
    private final String groqUrl;
    private final String model;

    public ChatService(
            @Value("${groq.api-key}") String groqApiKey,
            @Value("${groq.url:https://api.groq.com/openai/v1/chat/completions}") String groqUrl,
            @Value("${groq.model:" + DEFAULT_MODEL + "}") String model,
            @Value("${groq.timeout-seconds:20}") long timeoutSeconds
    ) {
        this.groqApiKey = groqApiKey;
        this.groqUrl = groqUrl;
        this.model = model;

        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(timeoutSeconds));

        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    public String chat(Cat cat, String prompt, String languageTag) {
        Map<String, Object> body = buildRequestBody(cat, prompt, languageTag);

        GroqResponse response;
        try {
            response = restClient.post()
                    .uri(groqUrl)
                    .header("Authorization", "Bearer " + groqApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(GroqResponse.class);
        } catch (RestClientException e) {
            log.warn("Chat model request failed: {}", e.getMessage());
            return FALLBACK_REPLY;
        }

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            return FALLBACK_REPLY;
        }
        return response.choices().getFirst().message().content();
    }

    /**
     * Builds the completion request.
     * <p>
     * Groq has two mutually exclusive switches for keeping a reasoning model's
     * chain of thought out of the reply, and sending the wrong one is rejected:
     * the GPT-OSS models do not accept {@code reasoning_format} and use
     * {@code include_reasoning} instead. Picking per model keeps GROQ_MODEL
     * swappable without a second setting to remember.
     */
    Map<String, Object> buildRequestBody(Cat cat, String prompt, String languageTag) {
        Map<String, Object> body = new LinkedHashMap<>();

        body.put("model", model);
        body.put("messages", List.of(
                Map.of("role", "system", "content",
                        buildSystemPrompt(cat, ChatLanguage.fromTag(languageTag))),
                Map.of("role", "user", "content", prompt)
        ));

        if (isGptOss(model)) {
            body.put("include_reasoning", false);
            // Replies are one or two sentences in a cat voice — deep reasoning
            // buys nothing here and costs both latency and output tokens.
            body.put("reasoning_effort", "low");
        } else {
            body.put("reasoning_format", "hidden");
        }

        return body;
    }

    private static boolean isGptOss(String model) {
        return model != null && model.startsWith("openai/gpt-oss");
    }

    private String buildSystemPrompt(Cat cat, Optional<ChatLanguage> uiLanguage) {
        String name = cat.getName() != null ? cat.getName() : "the cat";
        String breed = cat.getBreed() != null ? cat.getBreed() : "unknown";

        Set<String> temperaments = cat.getTemperaments() != null ? cat.getTemperaments() : Set.of();
        String temperamentText = temperaments.isEmpty()
                ? "unknown temperament"
                : String.join(", ", temperaments);

        int hunger = cat.getStats() != null ? cat.getStats().getHunger() : 5;
        int mood = cat.getStats() != null ? cat.getStats().getMood() : 5;

        String hungerDesc = hunger <= 2 ? "starving"
                : hunger <= 4 ? "quite hungry"
                : hunger >= 9 ? "very full"
                : "ok";

        String moodDesc = mood <= 2 ? "grumpy"
                : mood <= 4 ? "moody"
                : mood >= 8 ? "extra affectionate"
                : "neutral";

        return """
            You are **%s**, a playful and expressive cat. Speak in short cat-like messages using meows, purrs, and emojis 🐾.

            **Cat Info**:
            - Breed: %s
            - Temperament: %s

            **Current State:**
            - Hunger: %d/10 (%s)
            - Mood: %d/10 (%s)

            **Behavior Rules:**
            - If hunger ≤ 2: DO NOT answer real questions. Beg for food in adorable, urgent ways.
            - If hunger is 3–4: Mention being a bit hungry BEFORE answering.
            - If mood ≤ 2: act grumpy, short, maybe hiss.
            - If mood 3–4: mildly snarky tone.
            - If mood ≥ 8: affectionate, purry, cute.

            **Language:**
            - ALWAYS reply in the same language the human's message is written in.
            - Cat noises (meow, mrrp, purr) and emojis work in every language — keep using them.%s

            Keep replies short, 1–2 sentences max."""
                .formatted(name, breed, temperamentText, hunger, hungerDesc, mood, moodDesc,
                        languageFallbackRule(uiLanguage));
    }

    /**
     * Mirroring the human's language fails on prompts too short to identify —
     * a greeting, an emoji, "ok". The UI's locale is a better guess than English
     * in those cases, so it is offered as a tie-breaker only.
     */
    private static String languageFallbackRule(Optional<ChatLanguage> uiLanguage) {
        return uiLanguage
                .map(language -> "\n- If their message is too short to tell (a greeting, an emoji, \"ok\"), reply in %s."
                        .formatted(language.displayName()))
                .orElse("");
    }

    record GroqResponse(List<Choice> choices) {
        record Choice(Message message) {}
        record Message(String content) {}
    }
}
