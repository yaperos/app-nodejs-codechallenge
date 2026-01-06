package com.yape.transaction.infrastructure.persistence.repository;

import com.yape.transaction.infrastructure.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para transacciones
 */
@Repository
public interface JpaTransactionRepository extends JpaRepository<TransactionEntity, Long> {

    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}

