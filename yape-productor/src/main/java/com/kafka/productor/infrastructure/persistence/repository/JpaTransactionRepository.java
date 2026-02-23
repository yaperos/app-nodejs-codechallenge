package com.kafka.productor.infrastructure.persistence.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;

public interface  JpaTransactionRepository extends JpaRepository<TransactionEntity, Long> {

    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}
