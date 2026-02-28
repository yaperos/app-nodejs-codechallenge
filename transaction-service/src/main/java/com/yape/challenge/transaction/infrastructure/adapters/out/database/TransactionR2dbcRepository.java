package com.yape.challenge.transaction.infrastructure.adapters.out.database;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionR2dbcRepository extends ReactiveCrudRepository<TransactionEntity, UUID> {
}
