package com.yape.antifraud.consumer;

import com.yape.antifraud.producer.AntiFraudProducer;
import com.yape.antifraud.service.AntiFraudService;
import com.yape.shared.TransactionCreatedEvent;
import com.yape.shared.TransactionValidatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AntiFraudConsumer {

    private final AntiFraudService service;
    private final AntiFraudProducer producer;

    public AntiFraudConsumer(AntiFraudService service,
                             AntiFraudProducer producer) {
        log.info("AntiFraudConsumer INICIALIZADO");
        this.service = service;
        this.producer = producer;
    }

    @KafkaListener(
            topics = "transaction-created",
            groupId = "antifraud-group"
    )
    public void validate(TransactionCreatedEvent event) {
        log.info("Mensaje recibido en antifraud-group!");
        log.info("ID: {}", event.transactionExternalId());
        log.info("Valor: {}", event.value());

        try {
            String status = String.valueOf(service.validate(event.value()));
            log.info("Status calculado: {}", status);

            producer.sendValidationResult(
                    new TransactionValidatedEvent(
                            event.transactionExternalId(),
                            status
                    )
            );
            log.info("Resultado enviado");

        } catch (Exception e) {
            log.error("Error procesando transacción: {}", event.transactionExternalId(), e);
        }
    }
}