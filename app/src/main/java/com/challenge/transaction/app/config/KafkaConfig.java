package com.challenge.transaction.app.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic transactionCreatedTopic() {
        return new NewTopic("transaction-created", 3, (short) 1);
    }

    @Bean
    public NewTopic transactionValidatedTopic() {
        return new NewTopic("transaction-validated", 3, (short) 1);
    }
}
