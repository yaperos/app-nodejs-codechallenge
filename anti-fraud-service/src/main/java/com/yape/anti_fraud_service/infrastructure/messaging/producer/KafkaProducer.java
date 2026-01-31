package com.yape.anti_fraud_service.infrastructure.messaging.producer;

import com.yape.anti_fraud_service.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@AllArgsConstructor
public class KafkaProducer {

  private final KafkaTemplate<String, TransactionStatusUpdatedEvent> kafkaTemplate;


    public Mono<Void> sendTransactionStatusUpdated(TransactionStatusUpdatedEvent event) {
        log.info("Preparing to send transaction status updated event: {}", event);
        return Mono.fromRunnable(() -> {
            kafkaTemplate.send("transaction.status.updated", event.getTransactionExternalId().toString(), event);
            log.info("Transaction status updated event sent: {}", event);
        });
    }
}
