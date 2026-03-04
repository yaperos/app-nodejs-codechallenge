package com.yape.business.financial.infrastructure.datastore.repository;

import com.yape.business.financial.infrastructure.datastore.entity.EventEntity;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface EventStoreRepository extends ReactiveCrudRepository<EventEntity, Long> {
    //@Query("SELECT * FROM event_store e WHERE transaction_id = :transactionId AND status")
    Mono<EventEntity> findByTransactionId(UUID transactionId);
}
