package com.jotace.transaction.infrastructure.adapter.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Custom query method to find the entity by its public UUID
    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}
