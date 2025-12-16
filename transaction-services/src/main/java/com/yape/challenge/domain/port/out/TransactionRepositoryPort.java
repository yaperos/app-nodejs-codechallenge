package com.yape.challenge.domain.port.out;

import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryRequest;
import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.TransactionRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.TransactionValidationRepositoryRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionRepositoryPort {
    Mono<TransactionModelRepositoryResponse> save(TransactionModelRepositoryRequest transaction);
    Mono<Void> update(TransactionValidationRepositoryRequest transaction);
    Flux<TransactionRepositoryResponse> getTransaction(UUID transactionId);

}
