package com.yape.transaction.application.service;

import com.yape.transaction.application.dto.CreateTransactionCommand;
import com.yape.transaction.application.dto.TransactionResponse;
import com.yape.transaction.domain.exception.InvalidTransactionException;
import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionType;
import com.yape.transaction.domain.port.EventPublisher;
import com.yape.transaction.domain.port.TransactionRepository;
import com.yape.transaction.infrastructure.messaging.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Servicio de aplicación para gestión de transacciones (Use Cases)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final EventPublisher eventPublisher;

    @Value("${kafka.topics.transaction-created}")
    private String transactionCreatedTopic;

    /**
     * Caso de uso: Crear transacción
     */
    @Transactional
    public TransactionResponse createTransaction(CreateTransactionCommand command) {
        log.info("Creating transaction for debit account: {}", command.getAccountExternalIdDebit());

        // Validaciones de negocio
        validateTransactionCommand(command);

        // Crear transacción en estado PENDING
        TransactionType transactionType = TransactionType.fromId(command.getTranferTypeId());
        Transaction transaction = Transaction.createPending(
                command.getAccountExternalIdDebit(),
                command.getAccountExternalIdCredit(),
                transactionType,
                command.getValue()
        );

        // Persistir transacción
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created with ID: {}", savedTransaction.getTransactionExternalId());

        // Publicar evento a Kafka
        publishTransactionCreatedEvent(savedTransaction);

        // Retornar respuesta
        return mapToResponse(savedTransaction);
    }

    /**
     * Caso de uso: Obtener transacción por ID externo
     */
    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(UUID transactionExternalId) {
        log.info("Getting transaction: {}", transactionExternalId);

        Transaction transaction = transactionRepository.findByExternalId(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));

        return mapToResponse(transaction);
    }

    /**
     * Actualiza el estado de una transacción (llamado por el consumer de Kafka)
     */
    @Transactional
    public void updateTransactionStatus(UUID transactionExternalId, String newStatus) {
        log.info("Updating transaction {} status to: {}", transactionExternalId, newStatus);

        Transaction transaction = transactionRepository.findByExternalId(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));

        // Actualizar estado
        transaction.updateStatus(com.yape.transaction.domain.model.TransactionStatus.fromName(newStatus));

        // Persistir cambios
        transactionRepository.update(transaction);
        log.info("Transaction {} updated to status: {}", transactionExternalId, newStatus);
    }

    private void validateTransactionCommand(CreateTransactionCommand command) {
        if (command.getAccountExternalIdDebit() == null) {
            throw new InvalidTransactionException("Debit account ID cannot be null");
        }
        if (command.getAccountExternalIdCredit() == null) {
            throw new InvalidTransactionException("Credit account ID cannot be null");
        }
        if (command.getValue() == null || command.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Transaction value must be greater than zero");
        }
        if (command.getTranferTypeId() == null) {
            throw new InvalidTransactionException("Transfer type ID cannot be null");
        }
    }

    private void publishTransactionCreatedEvent(Transaction transaction) {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType("TRANSACTION_CREATED")
                .timestamp(java.time.Instant.now().toString())
                .transactionExternalId(transaction.getTransactionExternalId())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransactionType().getId())
                .value(transaction.getValue())
                .build();

        eventPublisher.publish(
                transactionCreatedTopic,
                transaction.getTransactionExternalId().toString(),
                event
        );

        log.info("Published TransactionCreatedEvent for transaction: {}", transaction.getTransactionExternalId());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .transactionType(TransactionResponse.TransactionTypeDTO.builder()
                        .name(transaction.getTransactionType().getName())
                        .build())
                .transactionStatus(TransactionResponse.TransactionStatusDTO.builder()
                        .name(transaction.getTransactionStatus().getName())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

