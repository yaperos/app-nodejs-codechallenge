package com.pe.yape.service.challenge.transactions.config;

import com.pe.yape.service.challenge.transactions.avro.TransactionCreatedEvent;
import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import io.confluent.kafka.serializers.KafkaAvroSerializer;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.sender.SenderOptions;

import java.util.Map;

@Configuration
public class KafkaReactiveConfig {

    public static final String TOPIC_TRANSACTIONS_CREATED = "transactions.created";
    public static final String TOPIC_TRANSACTIONS_VALIDATED = "transactions.validated";

    @Bean
    public NewTopic transactionsCreatedTopic() {
        return new NewTopic(TOPIC_TRANSACTIONS_CREATED, 3, (short) 1);
    }

    @Bean
    public NewTopic transactionsValidatedTopic() {
        return new NewTopic(TOPIC_TRANSACTIONS_VALIDATED, 3, (short) 1);
    }

    @Bean
    public ReceiverOptions<String, TransactionValidatedEvent> receiverOptions() {
        Map<String, Object> consumerProperties = Map.of(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
                ConsumerConfig.GROUP_ID_CONFIG, "anti-fraud-service-group",
                ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest",
                "schema.registry.url", "http://localhost:8081",
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class,
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer.class
        );

        return ReceiverOptions.<String, TransactionValidatedEvent>create(consumerProperties)
                .subscription(java.util.List.of(TOPIC_TRANSACTIONS_VALIDATED));
    }

    @Bean
    public SenderOptions<String, TransactionCreatedEvent> senderOptions(){
        Map<String, Object> props = Map.of(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class,
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer.class,
                "schema.registry.url", "http://localhost:8081"
        );

        return SenderOptions.create(props);
    }



}
