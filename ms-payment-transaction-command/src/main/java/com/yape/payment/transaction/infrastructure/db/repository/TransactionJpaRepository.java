package com.yape.payment.transaction.infrastructure.db.repository;

import com.yape.payment.transaction.infrastructure.db.entity.TransactionEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Long> {
    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}