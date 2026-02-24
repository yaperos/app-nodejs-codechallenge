package com.yape.transaction_service.producer;

import com.yape.shared.TransactionCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "transaction-created";

    public TransactionProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTransactionCreated(TransactionCreatedEvent event) {
        log.info("Enviando evento de transacción: {}", event.transactionExternalId());

        kafkaTemplate.send(
                TOPIC,
                event.transactionExternalId().toString(),
                event
        ).whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Evento enviado exitosamente. Offset: {}",
                        result.getRecordMetadata().offset());
            } else {
                log.error("Error al enviar evento: {}", ex.getMessage(), ex);
            }
        });
    }
}