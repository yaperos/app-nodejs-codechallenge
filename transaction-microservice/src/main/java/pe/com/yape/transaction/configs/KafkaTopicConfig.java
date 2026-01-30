package pe.com.yape.transaction.configs;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name("transaction.created")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic transactionUpdatedTopic() {
        return TopicBuilder.name("transaction.updated")
                .partitions(1)
                .replicas(1)
                .build();
    }
}