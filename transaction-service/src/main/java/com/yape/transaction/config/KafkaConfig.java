package com.yape.transaction.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.event.FraudResultEvent;
import com.yape.transaction.serializer.JacksonDeserializer;
import com.yape.transaction.serializer.JacksonSerializer;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.sender.SenderOptions;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${kafka.topics.transactions}")
    private String transactionsTopic;

    @Value("${kafka.topics.fraud-results}")
    private String fraudResultsTopic;

    @Bean
    public ReactiveKafkaProducerTemplate<String, Object> reactiveKafkaProducerTemplate(
            ObjectMapper kafkaObjectMapper) {

        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);

        SenderOptions<String, Object> senderOptions = SenderOptions
                .<String, Object>create(props)
                .withValueSerializer(new JacksonSerializer<>(kafkaObjectMapper))
                .withKeySerializer(new StringSerializer());

        return new ReactiveKafkaProducerTemplate<>(senderOptions);
    }

    @Bean
    public ReactiveKafkaConsumerTemplate<String, FraudResultEvent> fraudResultConsumerTemplate(
            ObjectMapper kafkaObjectMapper) {

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "transaction-service-group");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ByteArrayDeserializer.class);

        ReceiverOptions<String, FraudResultEvent> options = ReceiverOptions
                .<String, FraudResultEvent>create(props)
                .withValueDeserializer(
                        new JacksonDeserializer<>(FraudResultEvent.class, kafkaObjectMapper)
                )
                .subscription(Collections.singleton("fraud-results"));

        return new ReactiveKafkaConsumerTemplate<>(options);
    }

    @Bean
    public NewTopic transactionsTopic() {
        log.info("Output Topic: {}", transactionsTopic);
        return TopicBuilder.name("transactions")
                .partitions(6)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic fraudResultsTopic() {
        log.info("Input Topic: {}", fraudResultsTopic);
        return TopicBuilder.name("fraud-results")
                .partitions(6)
                .replicas(1)
                .build();
    }
}
