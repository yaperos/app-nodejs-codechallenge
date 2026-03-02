package com.yape.transaction.infrastructure.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name("transaction.created")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic transactionStatusUpdatedTopic() {
        return TopicBuilder.name("transaction.status.updated")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
