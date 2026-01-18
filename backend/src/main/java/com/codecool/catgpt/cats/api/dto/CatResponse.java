package com.codecool.catgpt.cats.api.dto;

import com.codecool.catgpt.cats.domain.Cat;

import java.util.List;

public record CatResponse(
        Long id,
        String name,
        String breed,
        List<String> temperaments,
        StatsResponse stats,
        Boolean isDefaultCat,
        String image
) {
    public static CatResponse from(Cat c) {

        return new CatResponse(
                c.getId(),
                c.getName(),
                c.getBreed(),
                c.getTemperaments().stream().sorted(String.CASE_INSENSITIVE_ORDER).toList(),
                new StatsResponse(
                        c.getStats().getHunger(),
                        c.getStats().getMood(),
                        c.getStats().getHealth()
                ),
                c.isDefaultCat(),
                c.getImage()
        );
    }

    public record StatsResponse(int hunger, int mood, int health) {}
}
