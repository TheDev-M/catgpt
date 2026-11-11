package com.codecool.catgpt.breeds.app;

import com.codecool.catgpt.breeds.api.dto.BreedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class BreedService {

    private final BreedCatalogue catalogue;

    public BreedResponse getRandomBreedWithImage() {
        List<BreedCatalogue.CatApiBreed> breeds = catalogue.findAll();

        if (breeds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Breed data unavailable.");
        }

        var breed = breeds.get(ThreadLocalRandom.current().nextInt(breeds.size()));

        return new BreedResponse(
                breed.id(),
                breed.name(),
                breed.description(),
                breed.temperament(),
                breed.energy_level(),
                breed.grooming(),
                breed.health_issues(),
                catalogue.findImageUrl(breed.id())
        );
    }
}
