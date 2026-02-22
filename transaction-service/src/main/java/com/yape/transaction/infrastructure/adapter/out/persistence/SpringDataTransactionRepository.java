package com.yape.transaction.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface SpringDataTransactionRepository extends JpaRepository<TransactionJpaEntity, UUID> {
}
