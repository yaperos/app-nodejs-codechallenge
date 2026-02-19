package com.yape.yape.infrastructure.adapter.out.jpa.repository;

import com.yape.yape.infrastructure.adapter.out.jpa.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaTransactionRepository extends JpaRepository<TransactionEntity, UUID> {
}
