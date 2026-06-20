package com.codecool.catgpt.breeds.app;

import com.codecool.catgpt.breeds.api.dto.BreedResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BreedService {

    private final RestClient restClient;
    private static final String CAT_API_BASE = "https://api.thecatapi.com/v1";

    public BreedService(@Value("${thecatapi.api-key:}") String catApiKey) {
        RestClient.Builder builder = RestClient.builder();
        if (catApiKey != null && !catApiKey.isBlank()) {
            builder.defaultHeader("x-api-key", catApiKey);
        }
        this.restClient = builder.build();
    }

    public BreedResponse getRandomBreedWithImage() {
        List<CatApiBreed> breeds = restClient.get()
            .uri(CAT_API_BASE + "/breeds")
            .retrieve()
            .body(new ParameterizedTypeReference<>() {});

        if (breeds == null || breeds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Breed data unavailable");
        }

        CatApiBreed breed = breeds.get((int) (Math.random() * breeds.size()));

        List<CatApiImage> images = restClient.get()
            .uri(CAT_API_BASE + "/images/search?breed_ids=" + breed.id())
            .retrieve()
            .body(new ParameterizedTypeReference<>() {});

        String imageUrl = (images != null && !images.isEmpty()) ? images.get(0).url() : "";

        return new BreedResponse(
            breed.id(),
            breed.name(),
            breed.description(),
            breed.temperament(),
            breed.energy_level(),
            breed.grooming(),
            breed.health_issues(),
            imageUrl
        );
    }

    record CatApiBreed(
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
