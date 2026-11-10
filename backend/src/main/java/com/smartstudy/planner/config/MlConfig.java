package com.smartstudy.planner.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuration for Machine Learning integrations.
 * Provides a tuned RestTemplate bean with connect and read timeouts
 * to communicate with the FastAPI Python ML microservice.
 */
@Configuration
public class MlConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofMillis(2500))
                .setReadTimeout(Duration.ofMillis(3500))
                .build();
    }
}

