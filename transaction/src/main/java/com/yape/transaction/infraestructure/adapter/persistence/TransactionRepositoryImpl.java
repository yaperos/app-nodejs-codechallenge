package com.yape.transaction.infraestructure.adapter.persistence;

import com.yape.transaction.domain.entities.Transaction;
import com.yape.transaction.domain.enums.TransactionStatus;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class TransactionRepositoryImpl implements TransactionRepositoryPort {

    private static final Logger logger = LoggerFactory.getLogger(TransactionRepositoryImpl.class);
    private static final int MAX_RETRIES = 3;
    private static final Duration RETRY_DELAY = Duration.ofMillis(200);
    private static final String PENDING_INDEX = "idx_debit_credit_type_pending";

    private final TransactionR2dbcRepository transactionR2dbcRepository;

    @Override
    public Mono<Transaction> findById(String transactionExternalId) {
        return transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId);
    }

    @Override
    public Mono<Transaction> save(Transaction transaction) {
        return transactionR2dbcRepository.save(transaction)
                .retryWhen(Retry.backoff(MAX_RETRIES, RETRY_DELAY)
                        .filter(ex -> ex instanceof OptimisticLockingFailureException)
                        .doBeforeRetry(signal -> logger.warn(
                                "Retrying save for account: {}, attempt: {}",
                                transaction.getAccountExternalIdDebit(), signal.totalRetries() + 1)))
                .doOnSuccess(t -> logger.info("Transaction saved for account: {}",
                        transaction.getAccountExternalIdDebit()))
                .onErrorMap(this::isUniqueIndexViolation, ex -> {
                    logger.warn("Pending transaction already exists for debit: {}, credit: {}, type: {}",
                            transaction.getAccountExternalIdDebit(),
                            transaction.getAccountExternalIdCredit(),
                            transaction.getType());
                    return new ResponseStatusException(HttpStatus.CONFLICT,
                            "Ya existe una transacción pendiente para las cuentas debit: "
                            + transaction.getAccountExternalIdDebit()
                            + ", credit: " + transaction.getAccountExternalIdCredit()
                            + ", type: " + transaction.getType());
                })
                .doOnError(e -> logger.error("Failed to save for account: {}, error: {}",
                        transaction.getAccountExternalIdDebit(), e.getMessage()));
    }

    @Override
    public Mono<Void> updateStatus(String transactionExternalId, String status) {
        return transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId)
                .filter(transaction -> {
                    boolean isPending = TransactionStatus.PENDING.getValue().equals(transaction.getStatus());
                    if (!isPending) logger.warn("Skipping update for transaction {} because its status is '{}', not PENDING",
                            transactionExternalId, transaction.getStatus());
                    return isPending;
                })
                .flatMap(transaction -> {
                    transaction.setStatus(status);
                    transaction.setUpdatedAt(LocalDateTime.now());
                    return transactionR2dbcRepository.save(transaction)
                            .retryWhen(Retry.backoff(MAX_RETRIES, RETRY_DELAY)
                                    .filter(ex -> ex instanceof OptimisticLockingFailureException)
                                    .doBeforeRetry(signal -> logger.warn(
                                            "Retrying updateStatus for account: {}, attempt: {}",
                                            transaction.getAccountExternalIdDebit(),
                                            signal.totalRetries() + 1)));
                })
                .doOnError(e -> logger.error("Failed to update status: {}, error: {}",
                        transactionExternalId, e.getMessage()))
                .then();
    }

    private boolean isUniqueIndexViolation(Throwable ex) {
        return ex.getMessage().contains(PENDING_INDEX);
    }
}
