package com.yape.transactions.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
  Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}
