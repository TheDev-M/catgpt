package com.codecool.catgpt.breeds.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.List;

/**
 * Talks to TheCatAPI and caches the breed catalogue.
 * <p>
 * This lives in its own bean rather than inside {@link BreedService} because
 * {@code @Cacheable} is proxy-based: a call from a sibling method in the same class
 * would bypass the cache entirely.
 */
@Slf4j
@Component
public class BreedCatalogue {

    static final String BREEDS_CACHE = "catBreeds";

    private final RestClient restClient;
    private final String baseUrl;

    public BreedCatalogue(
            @Value("${thecatapi.api-key:}") String apiKey,
            @Value("${thecatapi.base-url:https://api.thecatapi.com/v1}") String baseUrl
    ) {
        this.baseUrl = baseUrl;

        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(10));

        RestClient.Builder builder = RestClient.builder().requestFactory(requestFactory);
        if (apiKey != null && !apiKey.isBlank()) {
            builder.defaultHeader("x-api-key", apiKey);
        }
        this.restClient = builder.build();
    }

    /**
     * The catalogue is ~70 entries that change essentially never, so it is fetched
     * once and reused instead of being pulled on every single cat catch.
     */
    @Cacheable(BREEDS_CACHE)
    public List<CatApiBreed> findAll() {
        try {
            List<CatApiBreed> breeds = restClient.get()
                    .uri(baseUrl + "/breeds")
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
            return breeds != null ? breeds : List.of();
        } catch (RestClientException e) {
            log.warn("Failed to load breed catalogue: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Breed data unavailable.");
        }
    }

    /** A missing image should not fail the catch — the popup falls back to a placeholder. */
    public String findImageUrl(String breedId) {
        try {
            List<CatApiImage> images = restClient.get()
                    .uri(baseUrl + "/images/search?breed_ids=" + breedId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
            return (images != null && !images.isEmpty()) ? images.getFirst().url() : "";
        } catch (RestClientException e) {
            log.warn("Failed to load image for breed {}: {}", breedId, e.getMessage());
            return "";
        }
    }

    @CacheEvict(value = BREEDS_CACHE, allEntries = true)
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000L)
    public void refreshDaily() {
        log.debug("Evicted cached breed catalogue");
    }

    public record CatApiBreed(
            String id,
            String name,
            String description,
            String temperament,
            Integer energy_level,
            Integer grooming,
            Integer health_issues
    ) {}

    record CatApiImage(String url) {}
}
