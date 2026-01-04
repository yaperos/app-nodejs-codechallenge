package com.yape.challenge.transaction.infrastructure.kafka.exception;

/**
 * Custom exception for Kafka producer errors
 */
public class KafkaProducerException extends RuntimeException {

    public KafkaProducerException(String message) {
        super(message);
    }

    public KafkaProducerException(String message, Throwable cause) {
        super(message, cause);
    }
}

