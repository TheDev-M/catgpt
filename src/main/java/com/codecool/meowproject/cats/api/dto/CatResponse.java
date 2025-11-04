package com.codecool.meowproject.cats.api.dto;

import com.codecool.meowproject.cats.domain.Cat;
import java.util.List;

public record CatResponse(
        Long id,
        String name,
        String breed,
        int hunger,
        int mood,
        int health,
        List<String> temperaments,
        String image
) {
    public static CatResponse from(Cat c) {
        var temps = c.getTemperaments().stream().map(Enum::name).toList();
        return new CatResponse(
                c.getId(),
                c.getName(),
                c.getBreed(),
                c.getStats().getHunger(),
                c.getStats().getMood(),
                c.getStats().getHealth(),
                temps,
                c.getImage()
        );
    }
}
