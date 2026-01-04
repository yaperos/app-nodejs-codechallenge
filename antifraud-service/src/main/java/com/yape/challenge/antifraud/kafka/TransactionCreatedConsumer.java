package com.yape.challenge.antifraud.kafka;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.kafka.KafkaTopics;
import com.yape.challenge.antifraud.service.AntiFraudService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionCreatedConsumer {

    private final AntiFraudService antiFraudService;

    @KafkaListener(topics = KafkaTopics.TRANSACTION_CREATED, groupId = "${spring.kafka.consumer.group-id}")
    public void consumeTransactionCreated(TransactionCreatedEvent event) {
        log.info("Received transaction created event: {}", event);

        try {
            antiFraudService.validateTransaction(event);
        } catch (Exception e) {
            log.error("Error processing transaction: {}", event.getTransactionExternalId(), e);
            throw e;
        }
    }
}

