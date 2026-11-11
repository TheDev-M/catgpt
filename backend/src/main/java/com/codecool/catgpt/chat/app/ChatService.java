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
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class ChatService {

    /** Returned when the model is unreachable, so an upstream outage reads as a sleepy cat. */
    private static final String FALLBACK_REPLY = "Zzz… 💤";

    private final RestClient restClient;
    private final String groqApiKey;
    private final String groqUrl;
    private final String model;

    public ChatService(
            @Value("${groq.api-key}") String groqApiKey,
            @Value("${groq.url:https://api.groq.com/openai/v1/chat/completions}") String groqUrl,
            @Value("${groq.model:qwen/qwen3.6-27b}") String model,
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

    public String chat(Cat cat, String prompt) {
        Map<String, Object> body = Map.of(
                "model", model,
                "reasoning_format", "hidden",
                "messages", List.of(
                        Map.of("role", "system", "content", buildSystemPrompt(cat)),
                        Map.of("role", "user", "content", prompt)
                )
        );

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

    private String buildSystemPrompt(Cat cat) {
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

            Keep replies short, 1–2 sentences max."""
                .formatted(name, breed, temperamentText, hunger, hungerDesc, mood, moodDesc);
    }

    record GroqResponse(List<Choice> choices) {
        record Choice(Message message) {}
        record Message(String content) {}
    }
}
