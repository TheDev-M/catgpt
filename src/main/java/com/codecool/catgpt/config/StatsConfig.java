package com.codecool.catgpt.config;

import com.codecool.catgpt.common.StatsLimits;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "meow.stats")
@Getter @Setter
public class StatsConfig {
    private int maxHunger = 10;
    private int maxMood = 10;
    private int maxHealth = 10;

    @Bean
    public StatsLimits statsLimits() {
        return new StatsLimits(maxHunger, maxMood, maxHealth);
    }
}
