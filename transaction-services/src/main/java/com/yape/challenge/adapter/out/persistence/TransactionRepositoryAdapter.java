package com.yape.challenge.adapter.out.persistence;

import com.yape.challenge.adapter.out.persistence.db.R2dbcTransactionRepository;
import com.yape.challenge.adapter.out.persistence.mapper.TransactionRepositoryMapper;
import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryRequest;
import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.TransactionRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.TransactionValidationRepositoryRequest;
import com.yape.challenge.domain.port.out.TransactionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {
    private static final Logger log = LoggerFactory.getLogger(TransactionRepositoryAdapter.class);
    private final R2dbcTransactionRepository repository;
    private final TransactionRepositoryMapper mapper;


    @Override
    public Mono<TransactionModelRepositoryResponse> save(TransactionModelRepositoryRequest transaction) {
        return repository.save(mapper.toMapRepository(transaction))
                .flatMap(el -> Mono.just((TransactionModelRepositoryResponse.builder()
                        .transactionId(el.getTransactionId()).build())));
    }

    @Override
    public Mono<Void> update(TransactionValidationRepositoryRequest transaction) {
        return repository.findById(transaction.getTransactionId())
                .flatMap(existing -> {
                    existing.setStatus(transaction.getStatus());
                    existing.setUpdateAt(OffsetDateTime.now());
                    return repository.save(existing);
                })
                .switchIfEmpty(Mono.error(new IllegalStateException("Transaction not found for update"))).then();
    }

    @Override
    public Flux<TransactionRepositoryResponse> getTransaction(UUID transactionId) {
        return repository.findById(transactionId)
                .map(mapper::toMapGetTransactionRepository)
                .switchIfEmpty(Mono.error(new IllegalStateException("Transaction not found for update"))).flux();
    }
}
