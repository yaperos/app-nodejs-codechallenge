package com.yape.anti_fraud_service.domain.model.repository;

import com.yape.anti_fraud_service.domain.model.entity.TransactionEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionsRepository extends ReactiveCrudRepository<TransactionEntity, UUID> {
    Mono<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);

}