package com.yape.challenge.antifraud.service;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class AntiFraudService {

    private static final BigDecimal FRAUD_THRESHOLD = new BigDecimal("1000");
    private final KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;

    public void validateTransaction(TransactionCreatedEvent event) {
        log.info("Validating transaction: {}", event.getTransactionExternalId());

        TransactionStatusEvent statusEvent = TransactionStatusEvent.builder()
                .transactionExternalId(event.getTransactionExternalId())
                .status(determineStatus(event.getValue()))
                .build();

        kafkaTemplate.send(KafkaTopics.TRANSACTION_STATUS_UPDATED,
                event.getTransactionExternalId().toString(),
                statusEvent);

        log.info("Transaction validation completed. ExternalId: {}, Status: {}",
                event.getTransactionExternalId(), statusEvent.getStatus());
    }

    private TransactionStatus determineStatus(BigDecimal value) {
        if (value.compareTo(FRAUD_THRESHOLD) > 0) {
            return TransactionStatus.REJECTED;
        }
        return TransactionStatus.APPROVED;
    }
}

