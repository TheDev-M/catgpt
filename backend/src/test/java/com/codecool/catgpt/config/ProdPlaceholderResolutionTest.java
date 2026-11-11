package com.codecool.catgpt.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * Guards the production configuration against unresolvable placeholders.
 * <p>
 * A property whose value is a bare {@code ${SOME_VAR}} is <em>present but
 * unresolvable</em> when the variable is unset. That defeats any default on the
 * {@code @Value} that reads it, and takes the whole application context down at
 * startup — which is only discovered on deploy. These tests resolve the prod
 * file against the documented environment so that failure surfaces in the suite.
 */
class ProdPlaceholderResolutionTest {

    /** The variables a production deployment is documented as having to set. */
    private static Map<String, Object> documentedEnvironment() {
        Map<String, Object> env = new HashMap<>();
        env.put("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/catgpt");
        env.put("SPRING_DATASOURCE_USERNAME", "catgpt");
        env.put("SPRING_DATASOURCE_PASSWORD", "secret");
        env.put("JWT_SECRET", "a-secret-key-that-is-at-least-32-characters");
        env.put("FRONTEND_URL", "https://catgpt-demo.netlify.app");
        env.put("GROQ_API_KEY", "test-key");
        return env;
    }

    private static StandardEnvironment environmentWith(Map<String, Object> vars) throws IOException {
        var environment = new StandardEnvironment();
        environment.getPropertySources().addFirst(new MapPropertySource("test-env", vars));

        new YamlPropertySourceLoader()
                .load("application-prod", new ClassPathResource("application-prod.yml"))
                .forEach(environment.getPropertySources()::addLast);

        return environment;
    }

    @Test
    void everyProdPropertyResolvesWithOnlyTheDocumentedVariablesSet() throws IOException {
        var environment = environmentWith(documentedEnvironment());

        // Touching each property forces nested placeholder resolution; an
        // unresolvable one throws exactly as it does during context startup.
        assertThatNoException().isThrownBy(() -> {
            environment.getProperty("spring.datasource.url");
            environment.getProperty("jwt.secret");
            environment.getProperty("app.frontend-url");
            environment.getProperty("app.cors.allowed-origins");
            environment.getProperty("groq.api-key");
            environment.getProperty("groq.model");
            environment.getProperty("thecatapi.api-key");
        });
    }

    @Test
    void corsOriginsFallBackToTheFrontendUrlWhenUnset() throws IOException {
        // Regression: this previously had no default, so an existing deployment
        // that had never heard of CORS_ALLOWED_ORIGINS failed to start.
        var environment = environmentWith(documentedEnvironment());

        assertThat(environment.getProperty("app.cors.allowed-origins"))
                .isEqualTo("https://catgpt-demo.netlify.app");
    }

    @Test
    void corsOriginsUseTheOverrideWhenItIsSet() throws IOException {
        var env = documentedEnvironment();
        env.put("CORS_ALLOWED_ORIGINS", "https://a.example,https://b.example");

        assertThat(environmentWith(env).getProperty("app.cors.allowed-origins"))
                .isEqualTo("https://a.example,https://b.example");
    }

    @Test
    void chatModelDefaultsToAProductionTierModel() throws IOException {
        var environment = environmentWith(documentedEnvironment());

        // Preview-tier models get retired; the default must not be one.
        assertThat(environment.getProperty("groq.model")).isEqualTo("openai/gpt-oss-120b");
    }

    @Test
    void theSchemaIsOwnedByMigrationsNotByHibernate() throws IOException {
        var environment = environmentWith(documentedEnvironment());

        assertThat(environment.getProperty("spring.jpa.hibernate.ddl-auto")).isEqualTo("validate");
        assertThat(environment.getProperty("spring.flyway.enabled")).isEqualTo("true");
    }
}
