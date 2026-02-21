package com.service.transaction.integration;

import com.service.transaction.integration.event.TransactionStatusUpdatedEvent;
import com.service.transaction.service.TransactionService;
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
  private final TransactionService transactionService;
  private final ObjectMapper objectMapper;

  @PostConstruct
  public void startConsuming() {
    KafkaReceiver.create(receiverOptions)
        .receive()
        .flatMap(record -> {
          log.info("Received event to topic: {} key: {}",
              record.topic(), record.key());
          return processEvent(record.value())
              .doOnSuccess(v -> record.receiverOffset().acknowledge())
              .doOnError(e -> log.error("An occurred an error: {}", e.getMessage()));
        })
        .subscribe();
  }

  private Mono<Void> processEvent(Object value) {
    try {
      String jsonValue = value.toString();
      TransactionStatusUpdatedEvent event = objectMapper.readValue(
          jsonValue, TransactionStatusUpdatedEvent.class
      );
      log.info("Updated record with transactionId: {} status: {}",
          event.getTransactionExternalId(), event.getStatus());
      return transactionService.updateStatus(
          event.getTransactionExternalId(),
          event.getStatus()
      );
    } catch (Exception e) {
      log.error("An occurred an error in processEvent: {}", e.getMessage());
      return reactor.core.publisher.Mono.empty();
    }
  }

}