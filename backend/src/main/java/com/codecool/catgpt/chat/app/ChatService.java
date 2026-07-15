package com.codecool.catgpt.chat.app;

import com.codecool.catgpt.chat.api.dto.ChatRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final RestClient restClient;
    private final String groqApiKey;
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "qwen/qwen3.6-27b";

    public ChatService(@Value("${groq.api-key}") String groqApiKey) {
        this.groqApiKey = groqApiKey;
        this.restClient = RestClient.create();
    }

    public String chat(ChatRequest request) {
        String systemPrompt = buildSystemPrompt(request.cat());

        Map<String, Object> body = Map.of(
            "model", MODEL,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", request.prompt())
            )
        );

        GroqResponse response = restClient.post()
            .uri(GROQ_URL)
            .header("Authorization", "Bearer " + groqApiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(GroqResponse.class);

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            return "Zzz… 💤";
        }
        return response.choices().get(0).message().content();
    }

    private String buildSystemPrompt(ChatRequest.CatContext cat) {
        if (cat == null) return "You are a mysterious cat. Stay vague. 🐾";

        String name = cat.name() != null ? cat.name() : "the cat";
        String breed = cat.breed() != null ? cat.breed() : "unknown";
        List<String> temperaments = cat.temperaments() != null ? cat.temperaments() : List.of();
        Map<String, Integer> stats = cat.stats() != null ? cat.stats() : Map.of();

        int hunger = stats.getOrDefault("hunger", 5);
        int mood = stats.getOrDefault("mood", 5);

        String hungerDesc = hunger <= 2 ? "starving"
            : hunger <= 4 ? "quite hungry"
            : hunger >= 9 ? "very full"
            : "ok";

        String moodDesc = mood <= 2 ? "grumpy"
            : mood <= 4 ? "moody"
            : mood >= 8 ? "extra affectionate"
            : "neutral";

        String temperamentText = temperaments.isEmpty() ? "unknown temperament" : String.join(", ", temperaments);

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
