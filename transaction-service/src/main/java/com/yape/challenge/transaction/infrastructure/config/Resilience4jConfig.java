package com.yape.challenge.transaction.infrastructure.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.core.registry.EntryAddedEvent;
import io.github.resilience4j.core.registry.EntryRemovedEvent;
import io.github.resilience4j.core.registry.EntryReplacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Resilience4j Circuit Breaker
 * Provides custom logging for Circuit Breaker events
 */
@Configuration
@Slf4j
public class Resilience4jConfig {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerRegistry registry = CircuitBreakerRegistry.ofDefaults();

        // Register event listeners for Circuit Breaker lifecycle
        registry.getEventPublisher()
                .onEntryAdded(this::onCircuitBreakerAdded)
                .onEntryRemoved(this::onCircuitBreakerRemoved)
                .onEntryReplaced(this::onCircuitBreakerReplaced);

        return registry;
    }

    private void onCircuitBreakerAdded(EntryAddedEvent<io.github.resilience4j.circuitbreaker.CircuitBreaker> event) {
        log.info("Circuit Breaker '{}' added", event.getAddedEntry().getName());

        // Register state transition listener
        event.getAddedEntry().getEventPublisher()
                .onStateTransition(e -> log.warn("Circuit Breaker '{}' state changed: {} -> {}",
                        event.getAddedEntry().getName(),
                        e.getStateTransition().getFromState(),
                        e.getStateTransition().getToState()))
                .onError(e -> log.error("Circuit Breaker '{}' recorded error: {}",
                        event.getAddedEntry().getName(),
                        e.getThrowable().getMessage()))
                .onSuccess(e -> log.debug("Circuit Breaker '{}' recorded success",
                        event.getAddedEntry().getName()));
    }

    private void onCircuitBreakerRemoved(EntryRemovedEvent<io.github.resilience4j.circuitbreaker.CircuitBreaker> event) {
        log.info("Circuit Breaker '{}' removed", event.getRemovedEntry().getName());
    }

    private void onCircuitBreakerReplaced(EntryReplacedEvent<io.github.resilience4j.circuitbreaker.CircuitBreaker> event) {
        log.info("Circuit Breaker '{}' replaced", event.getNewEntry().getName());
    }
}

