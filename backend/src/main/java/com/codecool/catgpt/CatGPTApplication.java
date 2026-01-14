package com.codecool.catgpt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CatGPTApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatGPTApplication.class, args);
    }
}
