package com.service.transaction.integration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.transaction.config.KafkaTopics;
import com.service.transaction.integration.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;

/**
 * <b>Class</b>: KafkaProducer<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

  private final KafkaSender<String, String> kafkaSender;
  private final ObjectMapper objectMapper;

  public Mono<Void> publishTransactionCreated(TransactionCreatedEvent event) {
    return publish(
        KafkaTopics.TRANSACTION_CREATED,
        event.getTransactionExternalId().toString(),
        event
    );
  }

  private Mono<Void> publish(String topic, String key, Object value) {
    try {
      String jsonValue = objectMapper.writeValueAsString(value);
      ProducerRecord<String, String> record = new ProducerRecord<>(topic, key, jsonValue);
      return kafkaSender
          .send(Mono.just(SenderRecord.create(record, null)))
          .doOnNext(r -> log.info("Received event to topic: {} key: {}", topic, key))
          .doOnError(e -> log.error("An occurred an error publishing message → {}", e.getMessage()))
          .then();
    } catch (JsonProcessingException e) {
      return Mono.error(new RuntimeException("An occurred an error deserializing", e));
    }
  }

}