package com.yape.yape.infrastructure.config;

import com.yape.yape.application.dto.TransactionCreatedEvent;
import com.yape.yape.application.dto.TransactionStatusUpdatedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    private Map<String, Object> baseConsumerProps(KafkaProperties kafkaProperties) {
        Map<String, Object> props = new HashMap<>(kafkaProperties.buildConsumerProperties());

        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);

        props.put(ErrorHandlingDeserializer.KEY_DESERIALIZER_CLASS, StringDeserializer.class);
        props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class);

        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return props;
    }

    @Bean(name = "transactionCreatedKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, TransactionCreatedEvent> transactionCreatedFactory(
            KafkaProperties kafkaProperties
    ) {
        Map<String, Object> props = baseConsumerProps(kafkaProperties);
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, TransactionCreatedEvent.class.getName());

        // OJO: no pasar deserializer custom (para que no aplique configure + setters)
        DefaultKafkaConsumerFactory<String, TransactionCreatedEvent> consumerFactory =
                new DefaultKafkaConsumerFactory<>(props);

        ConcurrentKafkaListenerContainerFactory<String, TransactionCreatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    @Bean(name = "transactionStatusKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, TransactionStatusUpdatedEvent> transactionStatusFactory(
            KafkaProperties kafkaProperties
    ) {
        Map<String, Object> props = baseConsumerProps(kafkaProperties);
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, TransactionStatusUpdatedEvent.class.getName());

        DefaultKafkaConsumerFactory<String, TransactionStatusUpdatedEvent> consumerFactory =
                new DefaultKafkaConsumerFactory<>(props);

        ConcurrentKafkaListenerContainerFactory<String, TransactionStatusUpdatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}
