package com.yape.transaction_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name("transaction.created").build();
    }

    @Bean
    public NewTopic transactionStatusTopic() {
        return TopicBuilder.name("transaction.status").build();
    }
}