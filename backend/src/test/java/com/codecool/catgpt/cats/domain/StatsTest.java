package com.codecool.catgpt.cats.domain;

import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.domain.Effect;
import com.codecool.catgpt.items.domain.StatType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class StatsTest {

    @Test
    void apply_shouldNotExceedLimits() {
        StatsLimits limits = mock(StatsLimits.class);
        when(limits.maxHunger()).thenReturn(10);

        Stats stats = new Stats(9, 5, 5);
        Effect effect = new Effect(StatType.HUNGER, 5);

        Stats updated = stats.apply(effect, limits);

        assertThat(updated.getHunger()).isEqualTo(10);
        assertThat(updated.getMood()).isEqualTo(5);
        assertThat(updated.getHealth()).isEqualTo(5);
    }

    @Test
    void decrement_shouldNotGoBelowZero() {
        Stats stats = new Stats(1, 1, 0);

        Stats updated = stats.decrement(StatType.HEALTH);

        assertThat(updated.getHealth()).isZero();
    }
}
