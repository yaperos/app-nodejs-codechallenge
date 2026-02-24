package com.yape.transaction.infrastructure.adapter.out.database.repository;

import com.yape.transaction.infrastructure.adapter.out.database.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
}
