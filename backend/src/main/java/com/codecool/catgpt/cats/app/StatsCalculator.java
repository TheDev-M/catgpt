package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.api.dto.SourceMetrics;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.common.StatsLimits;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
class StatsCalculator {

    private final StatsLimits limits;

    Stats fromSourceMetrics(SourceMetrics src) {
        int hunger = clamp(limits.maxHunger() - src.energyLevel(), limits.maxHunger());
        int mood   = clamp(limits.maxMood()   - src.grooming(), limits.maxMood());
        int health = clamp(limits.maxHealth() - src.healthIssues(), limits.maxHealth());

        return Stats.builder().hunger(hunger).mood(mood).health(health).build();
    }

    private static int clamp(int v, int max) {
        return Math.max(0, Math.min(v, max));
    }
}

