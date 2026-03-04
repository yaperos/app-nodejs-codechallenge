package com.yape.core.antifraud.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConnection {

    @Value("${app.kafka.topic-request}")
    private String requestTopic;

    @Value("${app.kafka.topic-result}")
    private String resultTopic;

    @Bean
    public NewTopic requestTopic() {
        return TopicBuilder.name(requestTopic)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic resultTopic() {
        return TopicBuilder.name(resultTopic)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
