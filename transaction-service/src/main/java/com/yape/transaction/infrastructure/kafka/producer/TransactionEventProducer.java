package com.yape.transaction.infrastructure.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.infrastructure.kafka.dto.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventProducer implements TransactionEventPublisher {

    private static final String TOPIC_TRANSACTION_CREATED = "transaction.created";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionId(transaction.getExternalId())
                .value(transaction.getValue())
                .transactionTypeId(transaction.getTransferTypeId())
                .accountExternalIdDebit(transaction.getAccountDebit())
                .accountExternalIdCredit(transaction.getAccountCredit())
                .createdAt(transaction.getCreatedAt())
                .build();

        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC_TRANSACTION_CREATED, transaction.getExternalId().toString(), payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish transaction created event for transactionId: {}",
                                    transaction.getExternalId(), ex);
                        } else {
                            log.info("Transaction created event published successfully for transactionId: {} to partition: {} with offset: {}",
                                    transaction.getExternalId(),
                                    result.getRecordMetadata().partition(),
                                    result.getRecordMetadata().offset());
                        }
                    });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize transaction created event for transactionId: {}",
                    transaction.getExternalId(), e);
            throw new RuntimeException("Failed to serialize transaction created event", e);
        }
    }
}
