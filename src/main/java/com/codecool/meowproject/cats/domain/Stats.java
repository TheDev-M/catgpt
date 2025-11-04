package com.codecool.meowproject.cats.domain;

import com.codecool.meowproject.common.StatsLimits;
import com.codecool.meowproject.items.domain.Effect;
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
            case HUNGER -> new Stats(Math.min(hunger + effect.getAmount(), limits.maxHunger()), mood, health);
            case MOOD   -> new Stats(hunger, Math.min(mood + effect.getAmount(), limits.maxMood()), health);
            case HEALTH -> new Stats(hunger, mood, Math.min(health + effect.getAmount(), limits.maxHealth()));
        };
    }
}
