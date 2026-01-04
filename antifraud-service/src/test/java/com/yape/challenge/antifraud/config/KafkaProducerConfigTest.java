package com.yape.challenge.antifraud.config;

import com.yape.challenge.common.dto.TransactionStatusEvent;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.kafka.bootstrap-servers=localhost:9092"
})
@DisplayName("Kafka Producer Config Tests")
class KafkaProducerConfigTest {

    @Autowired
    private ProducerFactory<String, TransactionStatusEvent> producerFactory;

    @Autowired
    private KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;

    @Test
    @DisplayName("Should create producer factory bean")
    void shouldCreateProducerFactoryBean() {
        assertNotNull(producerFactory);
    }

    @Test
    @DisplayName("Should create kafka template bean")
    void shouldCreateKafkaTemplateBean() {
        assertNotNull(kafkaTemplate);
    }

    @Test
    @DisplayName("Should configure producer factory with correct properties")
    void shouldConfigureProducerFactoryWithCorrectProperties() {
        var configMap = producerFactory.getConfigurationProperties();

        assertEquals("localhost:9092", configMap.get(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG));
        assertEquals(StringSerializer.class, configMap.get(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG));
        assertEquals(JsonSerializer.class, configMap.get(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG));
        assertEquals("all", configMap.get(ProducerConfig.ACKS_CONFIG));
        assertEquals(3, configMap.get(ProducerConfig.RETRIES_CONFIG));
        assertEquals(true, configMap.get(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG));
    }

    @Test
    @DisplayName("Should configure kafka template with producer factory")
    void shouldConfigureKafkaTemplateWithProducerFactory() {
        assertNotNull(kafkaTemplate.getProducerFactory());
    }
}

