package com.yape.transaction.infrastructure.config;

public final class KafkaTopics {

    public static final String TRANSACTION_CREATED = "yape.transaction.event.created.v1";
    public static final String TRANSACTION_STATUS_UPDATED = "yape.transaction.event.status-updated.v1";

    private KafkaTopics() {
    }
}
