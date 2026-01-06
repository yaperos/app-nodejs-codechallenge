package com.yape.payment.transaction.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.payment.transaction.api.dto.CreateTransactionRequest;
import com.yape.payment.transaction.api.dto.TransactionResponse;
import com.yape.payment.transaction.api.dto.TransactionStatusDto;
import com.yape.payment.transaction.api.dto.TransactionTypeDto;
import com.yape.payment.transaction.domain.TransactionStatus;
import com.yape.payment.transaction.domain.TransactionType;
import com.yape.payment.transaction.infrastructure.db.entity.OutboxEventEntity;
import com.yape.payment.transaction.infrastructure.db.entity.TransactionEntity;
import com.yape.payment.transaction.infrastructure.db.repository.OutboxEventJpaRepository;
import com.yape.payment.transaction.infrastructure.db.repository.TransactionJpaRepository;
import com.yape.payment.transaction.infrastructure.kafka.KafkaTopics;
import com.yape.payment.transaction.infrastructure.kafka.dto.TransactionCreatedEvent;
import com.yape.payment.transaction.shared.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.yape.payment.transaction.infrastructure.kafka.dto.TransactionValidatedEvent;


@Service
public class TransactionService {

    private final TransactionJpaRepository transactionRepository;
    private final OutboxEventJpaRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public TransactionService(
            TransactionJpaRepository transactionRepository,
            OutboxEventJpaRepository outboxRepository,
            ObjectMapper objectMapper) {
        this.transactionRepository = transactionRepository;
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(UUID.randomUUID());
        entity.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(request.getAccountExternalIdCredit());
        entity.setTransferTypeId(request.getTranferTypeId());
        entity.setValue(request.getValue());
        entity.setStatus(TransactionStatus.PENDING);

        TransactionEntity saved = transactionRepository.save(entity);

        enqueueTransactionCreated(saved);

        return toResponse(saved);
    }

    public TransactionResponse get(UUID transactionExternalId) {
        TransactionEntity entity = transactionRepository.findByTransactionExternalId(transactionExternalId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found: " + transactionExternalId));

        return toResponse(entity);
    }

    private void enqueueTransactionCreated(TransactionEntity tx) {
        TransactionCreatedEvent event = new TransactionCreatedEvent();
        event.setEventId(UUID.randomUUID());
        event.setTransactionExternalId(tx.getTransactionExternalId());
        event.setAccountExternalIdDebit(tx.getAccountExternalIdDebit());
        event.setAccountExternalIdCredit(tx.getAccountExternalIdCredit());
        event.setTranferTypeId(tx.getTransferTypeId());
        event.setValue(tx.getValue());
        event.setCreatedAt(tx.getCreatedAt());

        String payload;
        try {
            payload = objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize outbox payload", e);
        }

        OutboxEventEntity outbox = new OutboxEventEntity();
        outbox.setAggregateType("TRANSACTION");
        outbox.setAggregateId(tx.getTransactionExternalId());
        outbox.setEventType("TransactionCreated");
        outbox.setTopic(KafkaTopics.PAYMENT_TRANSACTION_CREATED_V1);
        outbox.setPayload(payload);
        outbox.setStatus(OutboxEventEntity.OutboxStatus.PENDING);

        outboxRepository.save(outbox);
    }

    private TransactionResponse toResponse(TransactionEntity entity) {
        TransactionResponse response = new TransactionResponse();
        response.setTransactionExternalId(entity.getTransactionExternalId());
        response.setValue(entity.getValue());
        response.setCreatedAt(entity.getCreatedAt());

        TransactionType type = mapType(entity.getTransferTypeId());
        response.setTransactionType(new TransactionTypeDto(type.name()));
        response.setTransactionStatus(new TransactionStatusDto(entity.getStatus().name()));

        return response;
    }

    private TransactionType mapType(Integer transferTypeId) {
        if (transferTypeId != null && transferTypeId == 1) {
            return TransactionType.TRANSFER;
        }
        return TransactionType.TRANSFER;
    }

    @Transactional
    public void applyValidationResult(TransactionValidatedEvent event) {
        if (event == null || event.getTransactionExternalId() == null) {
            return;
        }

        TransactionEntity entity = transactionRepository
                .findByTransactionExternalId(event.getTransactionExternalId())
                .orElse(null);

        if (entity == null) {
            // Puede pasar si llega un validated de una tx inexistente o DB no sincronizada.
            return;
        }

        // Idempotencia mínima: si ya está final
        if (entity.getStatus() == TransactionStatus.APPROVED
                || entity.getStatus() == TransactionStatus.REJECTED) {
            return;
        }

        TransactionStatus newStatus = mapValidatedResult(event.getResult());
        entity.setStatus(newStatus);

        transactionRepository.save(entity);
    }

    private TransactionStatus mapValidatedResult(String result) {
        if (result == null) {
            return TransactionStatus.REJECTED;
        }
        if ("APPROVED".equalsIgnoreCase(result)) {
            return TransactionStatus.APPROVED;
        }
        if ("REJECTED".equalsIgnoreCase(result)) {
            return TransactionStatus.REJECTED;
        }
        // safe default
        return TransactionStatus.REJECTED;
    }
}
