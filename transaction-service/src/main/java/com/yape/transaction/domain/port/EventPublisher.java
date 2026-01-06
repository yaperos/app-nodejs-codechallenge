package com.yape.transaction.domain.port;

/**
 * Port de salida para publicación de eventos (Hexagonal Architecture)
 */
public interface EventPublisher {

    /**
     * Publica un evento en el sistema de mensajería
     */
    <T> void publish(String topic, String key, T event);
}

