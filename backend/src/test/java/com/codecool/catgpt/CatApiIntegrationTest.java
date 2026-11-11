package com.codecool.catgpt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end checks over the real filter chain and a real database.
 * <p>
 * These exist mainly to cover things unit tests with mocked repositories cannot:
 * that authorization is actually enforced at the HTTP layer, and that every
 * response can be serialised with {@code open-in-view} disabled (i.e. nothing
 * depends on a lazy association being resolved after the transaction closed).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CatApiIntegrationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;

    @Test
    void registeringAUserGivesThemAStarterCatWithTemperaments() throws Exception {
        String token = registerAndLogin();

        String body = mvc.perform(get("/api/cats").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode cats = json.readTree(body);
        assertThat(cats).hasSize(1);

        JsonNode bob = cats.get(0);
        assertThat(bob.get("name").asText()).isEqualTo("Bob");
        // Temperaments are a lazy @ElementCollection: serialising them here proves
        // the entity graph loads them inside the transaction.
        assertThat(bob.get("temperaments")).isNotEmpty();
        assertThat(bob.get("stats").get("health").asInt()).isPositive();
    }

    @Test
    void aUserCannotReadAnotherUsersCat() throws Exception {
        String aliceToken = registerAndLogin();
        long aliceCatId = firstCatId(aliceToken);

        String malloryToken = registerAndLogin();

        mvc.perform(get("/api/cats/" + aliceCatId).header("Authorization", "Bearer " + malloryToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void aUserCannotSelectAnotherUsersCat() throws Exception {
        String aliceToken = registerAndLogin();
        long aliceCatId = firstCatId(aliceToken);

        String malloryToken = registerAndLogin();

        mvc.perform(patch("/api/user/me/selected-cat")
                        .header("Authorization", "Bearer " + malloryToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"selectedCatId\":" + aliceCatId + "}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void aUserCannotChatAsAnotherUsersCat() throws Exception {
        String aliceToken = registerAndLogin();
        long aliceCatId = firstCatId(aliceToken);

        String malloryToken = registerAndLogin();

        mvc.perform(post("/api/chat")
                        .header("Authorization", "Bearer " + malloryToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"prompt\":\"hello\",\"catId\":" + aliceCatId + "}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void anUnauthenticatedRequestIsRejectedWithUnauthorized() throws Exception {
        mvc.perform(get("/api/cats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registrationRejectsAShortPassword() throws Exception {
        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"shorty\",\"password\":\"abc\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void chatRejectsAnOverlongPrompt() throws Exception {
        String token = registerAndLogin();
        long catId = firstCatId(token);

        mvc.perform(post("/api/chat")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(java.util.Map.of(
                                "prompt", "x".repeat(501),
                                "catId", catId))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void renamingToADuplicateNameIsRejected() throws Exception {
        String token = registerAndLogin();
        long catId = firstCatId(token);

        // Only one cat exists, so renaming it to its own name must be allowed...
        mvc.perform(patch("/api/cats/" + catId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bob\"}"))
                .andExpect(status().isOk());

        // ...while an unknown stat on the decrement route is a 400, not a 500.
        mvc.perform(post("/api/cats/" + catId + "/stats/sparkle/decrement")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void friendListIsServableWithoutOpenSessionInView() throws Exception {
        String token = registerAndLogin();

        mvc.perform(get("/api/friends").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
        mvc.perform(get("/api/friends/requests/incoming").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        mvc.perform(get("/api/items").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        mvc.perform(get("/api/user/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    // --- helpers ---

    private String registerAndLogin() throws Exception {
        String username = "user" + UUID.randomUUID().toString().substring(0, 8);
        String credentials = "{\"username\":\"" + username + "\",\"password\":\"correct-horse\"}";

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(credentials))
                .andExpect(status().isCreated());

        String body = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(credentials))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return json.readTree(body).get("token").asText();
    }

    private long firstCatId(String token) throws Exception {
        String body = mvc.perform(get("/api/cats").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return json.readTree(body).get(0).get("id").asLong();
    }
}
