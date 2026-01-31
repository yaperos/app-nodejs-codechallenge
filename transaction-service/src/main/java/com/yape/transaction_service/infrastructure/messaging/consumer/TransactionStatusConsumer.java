package com.yape.transaction_service.infrastructure.messaging.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.yape.transaction_service.domain.repository.TransactionRepository;
import com.yape.transaction_service.domain.repository.TransactionStatusRepository;
import com.yape.transaction_service.infrastructure.messaging.event.TransactionStatusUpdatedEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionStatusConsumer {

    private final TransactionRepository transactionRepository;
    private final TransactionStatusRepository statusRepository;

    @KafkaListener(
            topics = "transaction.status.updated",
            groupId = "transaction-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(TransactionStatusUpdatedEvent event) {
        log.info("Received TransactionStatusUpdatedEvent: {}", event.getTransactionExternalId());
        transactionRepository
                .findByTransactionExternalId(event.getTransactionExternalId())
                .flatMap(transaction -> statusRepository.findByName(event.getStatus())
                        .flatMap(status -> {
                            if (status == null) {
                                log.error("Status {} not found for transaction {}",
                                        event.getStatus(), transaction.getTransactionExternalId());
                            }

                            log.info("Found status {} for transaction {}",
                                    status.getName(), transaction.getTransactionExternalId());

                            transaction.setStatus(status.getName());

                            log.info("Updating transaction {} status to {}",
                                    transaction.getTransactionExternalId(), status.getName());
                            return transactionRepository.save(transaction);
                        }))
                .doOnError(error -> log.error("Error processing TransactionStatusUpdatedEvent: {}", error.getMessage()))
                .subscribe();
    }
}
