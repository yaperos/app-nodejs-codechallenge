package org.beh.transactionservice.application.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.transactionservice.application.command.CreateTransactionCommand;
import org.beh.transactionservice.application.command.UpdateTransactionStatusCommand;
import org.beh.transactionservice.application.dto.TransactionDTO;
import org.beh.transactionservice.domain.exception.TransactionNotFoundException;
import org.beh.transactionservice.domain.model.Transaction;
import org.beh.transactionservice.domain.model.TransactionStatus;
import org.beh.transactionservice.domain.model.TransactionType;
import org.beh.transactionservice.infrastructure.cache.TransactionCacheService;
import org.beh.transactionservice.infrastructure.outbox.OutboxEvent;
import org.beh.transactionservice.infrastructure.outbox.OutboxRepository;
import org.beh.transactionservice.infrastructure.persistence.TransactionJpaRepository;
import org.beh.transactionservice.infrastructure.persistence.TransactionTypeJpaRepository;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionJpaRepository transactionRepository;
    private final TransactionTypeJpaRepository transactionTypeRepository;
    private final OutboxRepository outboxRepository;
    private final TransactionCacheService cacheService;
    private final ObjectMapper objectMapper;

    /**
     * CREATE — write path.
     *
     * Input:  { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }
     * Output: TransactionDTO matching the GET response shape
     */
    @Transactional
    public TransactionDTO createTransaction(CreateTransactionCommand command) {

        // Resolve TransactionType — fails fast if id doesn't exist
        TransactionType transactionType = transactionTypeRepository
                .findById(command.getTransferTypeId())
                .orElseThrow(() -> new IllegalArgumentException(
                    "TransactionType not found: " + command.getTransferTypeId()));

        Transaction transaction = Transaction.builder()
                .value(command.getValue())
                .accountExternalIdDebit(command.getAccountExternalIdDebit())
                .accountExternalIdCredit(command.getAccountExternalIdCredit())
                .transactionType(transactionType)
                .status(TransactionStatus.PENDING)
                .build();

        transaction = transactionRepository.save(transaction);

        // Outbox written atomically in same DB transaction
        OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateId(transaction.getId().toString())
                .aggregateType("Transaction")
                .eventType("TRANSACTION_CREATED")
                .payload(serialize(buildEventPayload(transaction)))
                .build();

        outboxRepository.save(outboxEvent);

        TransactionDTO dto = toDTO(transaction);
        cacheService.put(dto);

        log.info("Transaction [{}] created — type [{}] value [{}] status [PENDING]",
            transaction.getId(), transactionType.getName(), transaction.getValue());

        return dto;
    }

    /**
     * UPDATE STATUS — called by Kafka consumer when anti-fraud responds.
     * @Retryable handles optimistic lock conflicts transparently.
     */
    @Transactional
    @Retryable(
        retryFor = ObjectOptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 100, multiplier = 2, random = true)
    )
    public void updateTransactionStatus(UpdateTransactionStatusCommand command) {
        Transaction transaction = transactionRepository.findByIdForUpdate(command.getTransactionId())
                .orElseThrow(() -> new TransactionNotFoundException(command.getTransactionId()));

        switch (command.getStatus()) {
            case APPROVED -> transaction.approve();
            case REJECTED -> transaction.reject();
            default -> throw new IllegalArgumentException("Cannot set status to: " + command.getStatus());
        }

        transactionRepository.save(transaction);

        TransactionDTO dto = toDTO(transaction);
        cacheService.put(dto);

        log.info("Transaction [{}] status updated to [{}]", transaction.getId(), transaction.getStatus());
    }

    /**
     * GET — cache-aside.
     * Hot path: Redis < 1ms. Cold path: DB + cache warm ~5-20ms.
     */
    @Transactional(readOnly = true)
    public TransactionDTO getTransaction(UUID id) {
        return cacheService.get(id)
                .orElseGet(() -> {
                    log.debug("Cache miss for transaction [{}], loading from DB", id);
                    // JOIN FETCH transactionType in one query — avoids N+1
                    Transaction transaction = transactionRepository.findByIdWithType(id)
                            .orElseThrow(() -> new TransactionNotFoundException(id));
                    TransactionDTO dto = toDTO(transaction);
                    cacheService.put(dto);
                    return dto;
                });
    }

    // ─── Mapper ────────────────────────────────────────────────────────────

    /**
     * Maps to exact GET response contract:
     * {
     *   "transactionExternalId": "Guid",
     *   "transactionType": { "name": "" },
     *   "transactionStatus": { "name": "" },
     *   "value": 120,
     *   "createdAt": "Date"
     * }
     */
    private TransactionDTO toDTO(Transaction t) {
        return TransactionDTO.builder()
                .transactionExternalId(t.getId())
                .transactionType(TransactionDTO.TransactionTypeDTO.builder()
                        .name(t.getTransactionType().getName())
                        .build())
                .transactionStatus(TransactionDTO.TransactionStatusDTO.builder()
                        .name(t.getStatus().name())
                        .build())
                .value(t.getValue())
                .createdAt(t.getCreatedAt())
                .build();
    }

    // ─── Outbox payload ────────────────────────────────────────────────────

    private record TransactionCreatedPayload(
        String transactionId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        Integer transferTypeId,
        java.math.BigDecimal value,
        String status
    ) {}

    private TransactionCreatedPayload buildEventPayload(Transaction t) {
        return new TransactionCreatedPayload(
            t.getId().toString(),
            t.getAccountExternalIdDebit().toString(),
            t.getAccountExternalIdCredit().toString(),
            t.getTransactionType().getId(),
            t.getValue(),
            t.getStatus().name()
        );
    }

    private String serialize(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Serialization failed", e);
        }
    }
}
