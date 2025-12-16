package com.yape.challenge.adapter.out.persistence.db;

import com.yape.challenge.adapter.out.persistence.model.entity.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface R2dbcTransactionRepository extends ReactiveCrudRepository<Transaction, UUID> {
}
