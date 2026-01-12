package com.msucre.antifraud.infrastructure.kafka.configuration;


import com.msucre.shared.model.kafka.KafkaSharedConstants;
import com.msucre.shared.model.dto.event.TransactionEventDto;
import com.msucre.shared.model.dto.event.TransactionEventResponseDto;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.sender.SenderOptions;

import java.util.Collections;
import java.util.Map;

@Configuration
public class KafkaConfig {

  @Bean
  public ReactiveKafkaProducerTemplate<String, TransactionEventResponseDto> reactiveKafkaProducerTemplate(
      KafkaProperties properties) {
    Map<String, Object> producerProperties = properties.buildProducerProperties();
    producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    producerProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    return new ReactiveKafkaProducerTemplate<>(SenderOptions.create(producerProperties));
  }

  @Bean
  public ReactiveKafkaConsumerTemplate<String, TransactionEventDto> reactiveKafkaConsumerTemplate(
      KafkaProperties properties) {
    Map<String, Object> consumerProperties = properties.buildProducerProperties();
    consumerProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    consumerProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaSharedConstants.KAFKA_GROUP_ID);
    consumerProperties.put(JsonDeserializer.TRUSTED_PACKAGES, KafkaSharedConstants.MODEL_TRUSTED_PACKAGE);
    ReceiverOptions<String, TransactionEventDto> receiverOptions = ReceiverOptions.<String, TransactionEventDto>create(
        consumerProperties).subscription(Collections.singletonList(KafkaSharedConstants.EVENT_TOPIC));
    return new ReactiveKafkaConsumerTemplate<>(receiverOptions);
  }
}
