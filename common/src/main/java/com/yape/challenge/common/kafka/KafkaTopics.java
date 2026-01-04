package com.yape.challenge.common.kafka;

public class KafkaTopics {

    public static final String TRANSACTION_CREATED = "transaction-created";
    public static final String TRANSACTION_STATUS_UPDATED = "transaction-status-updated";

    private KafkaTopics() {
        throw new IllegalStateException("Constants class");
    }
}

