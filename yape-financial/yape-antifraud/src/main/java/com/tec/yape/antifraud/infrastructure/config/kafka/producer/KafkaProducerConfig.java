package com.tec.yape.antifraud.infrastructure.config.kafka.producer;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String boostrapServers;


    public Map<String, Object> producerConfig() {
        Map<String, Object> properties = new HashMap<>();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, boostrapServers);
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);// serializa: convirte de string a bytes
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);// serializa
        return properties;
    }

    @Bean
    public ProducerFactory<String, String> providerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfig());
    }

    // Envian mensaje
    @Bean
    public KafkaTemplate<String, String> kafkaTemplate(ProducerFactory<String, String> providerFactory) {// inyectando
        return new KafkaTemplate<>(providerFactory);
    }

}
