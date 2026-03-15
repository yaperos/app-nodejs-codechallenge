package com.challenge.transaction.app.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransactionJpaRepository
        extends JpaRepository<TransactionEntity, UUID> {
}
