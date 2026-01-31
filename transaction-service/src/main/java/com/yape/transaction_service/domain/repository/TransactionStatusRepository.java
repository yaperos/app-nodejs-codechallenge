package com.yape.transaction_service.domain.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import com.yape.transaction_service.domain.model.TransactionStatusModel;
import reactor.core.publisher.Mono;

public interface TransactionStatusRepository extends ReactiveCrudRepository<TransactionStatusModel, Long> {

    Mono<TransactionStatusModel> findByName(String name);

}
