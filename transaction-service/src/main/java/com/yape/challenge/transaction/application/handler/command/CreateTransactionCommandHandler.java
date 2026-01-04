package com.yape.challenge.transaction.application.handler.command;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.kafka.KafkaTopics;
import com.yape.challenge.transaction.application.command.CreateTransactionCommand;
import com.yape.challenge.transaction.application.dto.response.TransactionResponse;
import com.yape.challenge.transaction.application.handler.CommandHandler;
import com.yape.challenge.transaction.application.mapper.TransactionMapper;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.entity.TransactionType;
import com.yape.challenge.transaction.domain.event.TransactionCreatedDomainEvent;
import com.yape.challenge.transaction.infrastructure.eventstore.EventStore;
import com.yape.challenge.transaction.infrastructure.kafka.producer.KafkaProducerService;
import com.yape.challenge.transaction.infrastructure.repository.TransactionRepository;
import com.yape.challenge.transaction.infrastructure.repository.TransactionTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Handler for CreateTransactionCommand with Event Sourcing
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CreateTransactionCommandHandler implements CommandHandler<CreateTransactionCommand, TransactionResponse> {

    private final EventStore eventStore;
    private final TransactionRepository transactionRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final TransactionMapper transactionMapper;
    private final KafkaProducerService kafkaProducerService;

    @Override
    @Transactional
    public TransactionResponse handle(CreateTransactionCommand command) {
        log.info("Handling CreateTransactionCommand with Event Sourcing: {}", command);

        // 1. Generate unique transaction ID
        UUID transactionId = UUID.randomUUID();

        // 2. Create domain event
        TransactionCreatedDomainEvent domainEvent = TransactionCreatedDomainEvent.builder()
                .aggregateId(transactionId)
                .accountExternalIdDebit(command.getAccountExternalIdDebit())
                .accountExternalIdCredit(command.getAccountExternalIdCredit())
                .transferTypeId(command.getTranferTypeId())
                .value(command.getValue())
                .occurredAt(LocalDateTime.now())
                .build();

        // 3. Save event to Event Store (persistence)
        eventStore.saveEvent(domainEvent);
        log.info("Domain event persisted in Event Store for transaction: {}", transactionId);

        // 4. Apply event to create aggregate and save read model
        Transaction transaction = applyEvent(domainEvent);
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction read model saved with externalId: {}", savedTransaction.getExternalId());

        // 5. Get transaction type
        TransactionType transactionType = transactionTypeRepository.findById(command.getTranferTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction type not found"));

        // 6. Publish integration event to Kafka
        TransactionCreatedEvent kafkaEvent = transactionMapper.toCreatedEvent(savedTransaction);
        kafkaProducerService.sendTransactionCreatedEvent(
                KafkaTopics.TRANSACTION_CREATED,
                savedTransaction.getExternalId().toString(),
                kafkaEvent
        );
        log.info("Integration event published to Kafka for externalId: {}", savedTransaction.getExternalId());

        return transactionMapper.toResponse(savedTransaction, transactionType);
    }

    /**
     * Apply domain event to create transaction aggregate
     */
    private Transaction applyEvent(TransactionCreatedDomainEvent event) {
        return Transaction.builder()
                .externalId(event.getAggregateId())
                .accountExternalIdDebit(event.getAccountExternalIdDebit())
                .accountExternalIdCredit(event.getAccountExternalIdCredit())
                .transferTypeId(event.getTransferTypeId())
                .value(event.getValue())
                .status(TransactionStatus.PENDING)
                .createdAt(event.getOccurredAt())
                .updatedAt(event.getOccurredAt())
                .build();
    }
}
