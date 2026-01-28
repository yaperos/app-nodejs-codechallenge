package com.yape.antifraudservice.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    public static final String TRANSACTION_CREATED_TOPIC = "transaction-created";
    public static final String TRANSACTION_STATUS_TOPIC = "transaction-status";
}
