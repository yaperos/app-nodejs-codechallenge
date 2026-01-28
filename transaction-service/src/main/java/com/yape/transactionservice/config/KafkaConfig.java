package com.yape.transactionservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    public static final String TRANSACTION_CREATED_TOPIC = "transaction-created";
    public static final String TRANSACTION_STATUS_TOPIC = "transaction-status";

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name(TRANSACTION_CREATED_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic transactionStatusTopic() {
        return TopicBuilder.name(TRANSACTION_STATUS_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
