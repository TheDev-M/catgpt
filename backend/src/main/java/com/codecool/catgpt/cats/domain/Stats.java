package com.codecool.catgpt.cats.domain;

import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.domain.Effect;
import com.codecool.catgpt.items.domain.StatType;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stats {
    private int hunger;
    private int mood;
    private int health;

    public Stats apply(Effect effect, StatsLimits limits) {
        return switch (effect.getStat()) {
            case HUNGER -> new Stats(
                    Math.min(hunger + effect.getAmount(), limits.maxHunger()),
                    mood,
                    health
            );
            case MOOD -> new Stats(
                    hunger,
                    Math.min(mood + effect.getAmount(), limits.maxMood()),
                    health
            );
            case HEALTH -> new Stats(
                    hunger,
                    mood,
                    Math.min(health + effect.getAmount(), limits.maxHealth())
            );
        };
    }

    public Stats decrement(StatType stat) {
        return switch (stat) {
            case HUNGER -> new Stats(
                    Math.max(0, hunger - 1),
                    mood,
                    health
            );
            case MOOD -> new Stats(
                    hunger,
                    Math.max(0, mood - 1),
                    health
            );
            case HEALTH -> new Stats(
                    hunger,
                    mood,
                    Math.max(0, health - 1)
            );
        };
    }
}
