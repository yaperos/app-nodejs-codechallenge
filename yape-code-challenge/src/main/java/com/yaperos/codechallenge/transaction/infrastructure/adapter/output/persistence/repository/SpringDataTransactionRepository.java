package com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.repository;

import com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.entity.TransactionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataTransactionRepository extends JpaRepository<TransactionJpaEntity, UUID> {
}
