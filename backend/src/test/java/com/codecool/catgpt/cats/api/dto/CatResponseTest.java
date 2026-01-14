package com.codecool.catgpt.cats.api.dto;

import com.codecool.catgpt.cats.domain.Cat;
import com.codecool.catgpt.cats.domain.Stats;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class CatResponseTest {

    @Test
    void from_shouldMapAndSortTemperaments() {
        var cat = Cat.builder()
                .name("Whiskers")
                .breed("British Shorthair")
                .temperaments(Set.of("Playful", "Affectionate", "Calm"))
                .stats(new Stats(3, 7, 9))
                .image("img")
                .build();

        CatResponse res = CatResponse.from(cat);

        assertThat(res.name()).isEqualTo("Whiskers");
        assertThat(res.breed()).isEqualTo("British Shorthair");
        assertThat(res.temperaments())
                .containsExactly("Affectionate", "Calm", "Playful");

        assertThat(res.stats().hunger()).isEqualTo(3);
        assertThat(res.stats().mood()).isEqualTo(7);
        assertThat(res.stats().health()).isEqualTo(9);
        assertThat(res.image()).isEqualTo("img");
    }
}
