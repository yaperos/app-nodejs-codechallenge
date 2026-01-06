package pe.com.yape.transaction.infraestructure.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaTopicsConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${kafka.topics.transaction-created}")
    private String transactionCreatedTopic;

    @Value("${kafka.topics.transaction-approved}")
    private String transactionApprovedTopic;

    @Value("${kafka.topics.transaction-rejected}")
    private String transactionRejectedTopic;

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(configs);
    }

    @Bean
    public NewTopic transactionCreatedTopic() {
        return TopicBuilder.name(transactionCreatedTopic)
                .partitions(3)
                .replicas(1)
                .config("retention.ms", "60000")
                .config("compression.type", "snappy")
                .build();
    }

    @Bean
    public NewTopic transactionApprovedTopic() {
        return TopicBuilder.name(transactionApprovedTopic)
                .partitions(3)
                .replicas(1)
                .config("retention.ms", "60000")
                .config("compression.type", "snappy")
                .build();
    }

    @Bean
    public NewTopic transactionRejectedTopic() {
        return TopicBuilder.name(transactionRejectedTopic)
                .partitions(3)
                .replicas(1)
                .config("retention.ms", "60000")
                .config("compression.type", "snappy")
                .build();
    }

}
