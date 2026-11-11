package com.codecool.catgpt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableCaching    // breed catalogue lookups (BreedService)
@EnableScheduling // SSE heartbeats (SseService)
public class CatGPTApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatGPTApplication.class, args);
    }
}
