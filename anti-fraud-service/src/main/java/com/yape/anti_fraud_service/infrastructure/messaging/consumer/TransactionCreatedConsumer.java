package com.yape.anti_fraud_service.infrastructure.messaging.consumer;

import com.yape.anti_fraud_service.application.service.AntiFraudService;
import com.yape.anti_fraud_service.domain.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionCreatedConsumer {
    private final AntiFraudService antiFraudService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "transaction.created",
            containerFactory = "kafkaListenerContainerFactory",
            groupId = "anti-fraud-service")
    public void consume(String message) {
        try {
            log.info("Mensaje recibido: {}", message);

            Transaction transaction =
                    objectMapper.readValue(message, Transaction.class);

            antiFraudService.validateTransaction(transaction).subscribe();

        } catch (Exception e) {
            log.error("Error deserializando mensaje", e);
        }
    }
}
