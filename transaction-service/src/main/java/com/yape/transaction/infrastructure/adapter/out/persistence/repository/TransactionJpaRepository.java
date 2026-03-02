package com.yape.transaction.infrastructure.adapter.out.persistence.repository;

import com.yape.transaction.infrastructure.adapter.out.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Long> {

    // Use index for performance on high-volume reads
    @Query("SELECT t FROM TransactionEntity t WHERE t.transactionExternalId = :transactionExternalId")
    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}
