package com.devpull.transactionservice.adapter.out.persistence.repository;

import com.devpull.transactionservice.adapter.out.persistence.entity.TransactionEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface R2dbcTransactionRepository extends ReactiveCrudRepository<TransactionEntity, UUID> {
}
