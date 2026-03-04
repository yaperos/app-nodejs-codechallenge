package com.yape.business.financial.infrastructure.service;

import io.r2dbc.postgresql.codec.Json;
import com.yape.business.financial.infrastructure.datastore.entity.EventEntity;
import com.yape.business.financial.infrastructure.datastore.repository.EventStoreRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventStoreService {
    private final EventStoreRepository eventStoreRepository;
    private final TransactionalOperator operator;

    public Mono<EventEntity> storeEvent(UUID transactionId, String eventType, String payload) {
        EventEntity event = new EventEntity(null, transactionId, eventType, Json.of(payload), Instant.now());
        return eventStoreRepository.save(event)
                .as(operator::transactional);
    }

    public Mono<EventEntity> findById(UUID transactionId) {
        return eventStoreRepository.findByTransactionId(transactionId)
                .as(operator::transactional);
    }
}
