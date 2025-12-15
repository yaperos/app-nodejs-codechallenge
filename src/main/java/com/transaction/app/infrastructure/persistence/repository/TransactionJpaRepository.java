package com.transaction.app.infrastructure.persistence.repository;

import com.transaction.app.infrastructure.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransactionJpaRepository
        extends JpaRepository<TransactionEntity, Long> {

    Optional<TransactionEntity> findByTransactionExternalId(UUID externalId);
}
