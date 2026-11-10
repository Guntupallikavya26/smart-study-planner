package com.smartstudy.planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Smart Study Planner Spring Boot Backend.
 *
 * Annotations:
 * - @SpringBootApplication: Combines @Configuration, @EnableAutoConfiguration,
 *   and @ComponentScan, automatically discovering and registering all Spring
 *   components in the 'com.smartstudy.planner' package hierarchy.
 */
@SpringBootApplication
public class SmartStudyPlannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartStudyPlannerApplication.class, args);
    }
}

