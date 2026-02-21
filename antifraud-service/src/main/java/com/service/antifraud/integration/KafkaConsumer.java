package com.service.antifraud.integration;

import com.service.antifraud.integration.event.TransactionCreatedEvent;
import com.service.antifraud.service.RuleService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import tools.jackson.databind.ObjectMapper;

/**
 * <b>Class</b>: KafkaConsumer<br/>
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
public class KafkaConsumer {

  private final ReceiverOptions<String, String> receiverOptions;
  private final RuleService ruleService;
  private final ObjectMapper objectMapper;

  @PostConstruct
  public void startConsuming() {
    KafkaReceiver.create(receiverOptions)
        .receive()
        .flatMap(record -> {
          log.info("Received message to topic: {} with key: {}",
              record.topic(), record.key());
          return processEvent(record.value())
              .doOnSuccess(v -> record.receiverOffset().acknowledge())
              .doOnError(e -> log.error("An error occurred event: {}", e.getMessage()));
        })
        .subscribe();
  }

  private Mono<Void> processEvent(Object value) {
    try {
      String jsonValue = value.toString();
      TransactionCreatedEvent event = objectMapper.readValue(
          jsonValue,
          TransactionCreatedEvent.class
      );
      log.info("Updated status with transactionExternalId: {}",
          event.getTransactionExternalId());
      return ruleService.validate(event);
    } catch (Exception e) {
      log.error("An occurred an error parsing: {}", e.getMessage());
      return Mono.empty();
    }
  }

}