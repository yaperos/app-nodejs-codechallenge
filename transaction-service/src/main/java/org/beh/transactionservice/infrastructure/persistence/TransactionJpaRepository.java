package org.beh.transactionservice.infrastructure.persistence;

import jakarta.persistence.LockModeType;
import org.beh.transactionservice.domain.model.Transaction;
import org.beh.transactionservice.domain.model.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TransactionJpaRepository extends JpaRepository<Transaction, UUID> {

    /**
     * JOIN FETCH transactionType — loads the type in a single query.
     * Without this, accessing t.getTransactionType().getName() after the
     * session closes would throw LazyInitializationException.
     */
    @Query("SELECT t FROM Transaction t JOIN FETCH t.transactionType WHERE t.id = :id")
    Optional<Transaction> findByIdWithType(@Param("id") UUID id);

    /**
     * Used for status update — OPTIMISTIC_FORCE_INCREMENT ensures
     * version bump even when no fields change on the loaded entity.
     */
    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Query("SELECT t FROM Transaction t JOIN FETCH t.transactionType WHERE t.id = :id")
    Optional<Transaction> findByIdForUpdate(@Param("id") UUID id);

    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);

    @Query("SELECT t FROM Transaction t JOIN FETCH t.transactionType " +
           "WHERE t.accountExternalIdDebit = :accountId OR t.accountExternalIdCredit = :accountId")
    Page<Transaction> findByAccount(@Param("accountId") UUID accountId, Pageable pageable);
}
