package com.codecool.catgpt.cats.app;

import com.codecool.catgpt.cats.api.dto.SourceMetrics;
import com.codecool.catgpt.cats.domain.Stats;
import com.codecool.catgpt.common.StatsLimits;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class StatsCalculatorTest {

    private final StatsLimits limits = mock(StatsLimits.class);
    private final StatsCalculator calculator = new StatsCalculator(limits);

    @Test
    void fromSourceMetrics_shouldCalculateStatsCorrectly() {
        when(limits.maxHunger()).thenReturn(10);
        when(limits.maxMood()).thenReturn(10);
        when(limits.maxHealth()).thenReturn(10);

        var src = new SourceMetrics(3, 2, 4);

        Stats stats = calculator.fromSourceMetrics(src);

        assertThat(stats.getHunger()).isEqualTo(7);
        assertThat(stats.getMood()).isEqualTo(8);
        assertThat(stats.getHealth()).isEqualTo(6);
    }

    @Test
    void fromSourceMetrics_shouldClampAtZero() {
        when(limits.maxHunger()).thenReturn(3);
        when(limits.maxMood()).thenReturn(3);
        when(limits.maxHealth()).thenReturn(3);

        var src = new SourceMetrics(5, 5, 5);

        Stats stats = calculator.fromSourceMetrics(src);

        assertThat(stats.getHunger()).isZero();
        assertThat(stats.getMood()).isZero();
        assertThat(stats.getHealth()).isZero();
    }
}
