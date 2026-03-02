package com.yape.antifraud.infrastructure.persistence.repository;

import com.yape.antifraud.infrastructure.persistence.entity.EvaluatedTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for evaluated transaction entities.
 * Since transactionId is the primary key, existsById and findById are used directly.
 */
@Repository
public interface JpaEvaluatedTransactionRepository extends JpaRepository<EvaluatedTransactionEntity, UUID> {

    /**
     * Checks if a transaction has already been evaluated.
     * Delegates to existsById since transactionId is the primary key.
     *
     * @param transactionId the transaction identifier
     * @return true if the transaction exists
     */
    boolean existsByTransactionId(UUID transactionId);
}
