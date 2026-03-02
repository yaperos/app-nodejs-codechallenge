package com.yape.infra.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.kafka.support.serializer.JsonSerializer;

import reactor.kafka.sender.SenderOptions;

@Configuration
public class KafkaProducerReactiveConfig {

  @Bean
  public ReactiveKafkaProducerTemplate<String, Object> reactiveKafkaProducerTemplate() {
    Map<String, Object> props = new HashMap<>();
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

    SenderOptions<String, Object> senderOptions = SenderOptions.create(props);
    return new ReactiveKafkaProducerTemplate<>(senderOptions);
  }
}
