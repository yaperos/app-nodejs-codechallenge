package com.yape.antifraud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Anti-fraud microservice.
 * This service consumes transaction events from Kafka, evaluates them
 * against anti-fraud rules, and publishes the evaluation result.
 *
 * No REST endpoints are exposed - communication is event-driven via Kafka.
 */
@SpringBootApplication
public class AntifraudServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AntifraudServiceApplication.class, args);
    }
}
