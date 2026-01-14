package com.codecool.catgpt.cats.api.dto;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class CatCreateRequestTest {

    @Test
    void shouldStoreAllFields() {
        var metrics = new SourceMetrics(2, 3, 1);

        var req = new CatCreateRequest(
                "Milo",
                "Maine Coon",
                Set.of("Playful", "Gentle"),
                metrics,
                "image"
        );

        assertThat(req.name()).isEqualTo("Milo");
        assertThat(req.breed()).isEqualTo("Maine Coon");
        assertThat(req.temperaments()).containsExactlyInAnyOrder("Playful", "Gentle");
        assertThat(req.sourceMetrics()).isSameAs(metrics);
        assertThat(req.image()).isEqualTo("image");
    }
}
