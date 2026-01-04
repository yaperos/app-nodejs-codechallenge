package com.yape.challenge.antifraud.config;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.kafka.bootstrap-servers=localhost:9092",
        "spring.kafka.consumer.group-id=test-group"
})
@DisplayName("Kafka Consumer Config Tests")
class KafkaConsumerConfigTest {

    @Autowired
    private ConsumerFactory<String, TransactionCreatedEvent> consumerFactory;

    @Autowired
    private ConcurrentKafkaListenerContainerFactory<String, TransactionCreatedEvent> kafkaListenerContainerFactory;

    @Test
    @DisplayName("Should create consumer factory bean")
    void shouldCreateConsumerFactoryBean() {
        assertNotNull(consumerFactory);
    }

    @Test
    @DisplayName("Should create kafka listener container factory bean")
    void shouldCreateKafkaListenerContainerFactoryBean() {
        assertNotNull(kafkaListenerContainerFactory);
    }

    @Test
    @DisplayName("Should configure consumer factory with correct properties")
    void shouldConfigureConsumerFactoryWithCorrectProperties() {
        var configMap = consumerFactory.getConfigurationProperties();

        assertEquals("localhost:9092", configMap.get(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG));
        assertEquals("test-group", configMap.get(ConsumerConfig.GROUP_ID_CONFIG));
        assertEquals(StringDeserializer.class, configMap.get(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG));
        assertEquals(JsonDeserializer.class, configMap.get(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG));
        assertEquals("earliest", configMap.get(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG));
    }

    @Test
    @DisplayName("Should configure kafka listener container factory with consumer factory")
    void shouldConfigureKafkaListenerContainerFactoryWithConsumerFactory() {
        assertNotNull(kafkaListenerContainerFactory.getConsumerFactory());
    }
}

