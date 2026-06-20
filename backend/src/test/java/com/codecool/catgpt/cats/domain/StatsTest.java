package com.codecool.catgpt.cats.domain;

import com.codecool.catgpt.common.StatsLimits;
import com.codecool.catgpt.items.domain.Effect;
import com.codecool.catgpt.items.domain.StatType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StatsTest {

    private static final StatsLimits LIMITS_10 = new StatsLimits(10, 10, 10);

    // --- apply ---

    @Test
    void apply_hunger_shouldIncreaseOnlyHunger() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.apply(new Effect(StatType.HUNGER, 3), LIMITS_10);

        assertThat(result.getHunger()).isEqualTo(8);
        assertThat(result.getMood()).isEqualTo(5);
        assertThat(result.getHealth()).isEqualTo(5);
    }

    @Test
    void apply_mood_shouldIncreaseOnlyMood() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.apply(new Effect(StatType.MOOD, 2), LIMITS_10);

        assertThat(result.getHunger()).isEqualTo(5);
        assertThat(result.getMood()).isEqualTo(7);
        assertThat(result.getHealth()).isEqualTo(5);
    }

    @Test
    void apply_health_shouldIncreaseOnlyHealth() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.apply(new Effect(StatType.HEALTH, 4), LIMITS_10);

        assertThat(result.getHunger()).isEqualTo(5);
        assertThat(result.getMood()).isEqualTo(5);
        assertThat(result.getHealth()).isEqualTo(9);
    }

    @Test
    void apply_shouldCapAtMax() {
        StatsLimits limits = mock(StatsLimits.class);
        when(limits.maxHunger()).thenReturn(10);
        Stats stats = new Stats(9, 5, 5);

        Stats result = stats.apply(new Effect(StatType.HUNGER, 5), limits);

        assertThat(result.getHunger()).isEqualTo(10);
    }

    // --- decrement ---

    @Test
    void decrement_hunger_shouldDecreaseOnlyHunger() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.decrement(StatType.HUNGER);

        assertThat(result.getHunger()).isEqualTo(4);
        assertThat(result.getMood()).isEqualTo(5);
        assertThat(result.getHealth()).isEqualTo(5);
    }

    @Test
    void decrement_mood_shouldDecreaseOnlyMood() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.decrement(StatType.MOOD);

        assertThat(result.getHunger()).isEqualTo(5);
        assertThat(result.getMood()).isEqualTo(4);
        assertThat(result.getHealth()).isEqualTo(5);
    }

    @Test
    void decrement_health_shouldDecreaseOnlyHealth() {
        Stats stats = new Stats(5, 5, 5);

        Stats result = stats.decrement(StatType.HEALTH);

        assertThat(result.getHunger()).isEqualTo(5);
        assertThat(result.getMood()).isEqualTo(5);
        assertThat(result.getHealth()).isEqualTo(4);
    }

    @ParameterizedTest
    @EnumSource(StatType.class)
    void decrement_atZero_shouldNotGoBelowZero(StatType stat) {
        Stats stats = new Stats(0, 0, 0);

        Stats result = stats.decrement(stat);

        assertThat(result.getHunger()).isZero();
        assertThat(result.getMood()).isZero();
        assertThat(result.getHealth()).isZero();
    }
}
