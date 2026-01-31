package com.yape.transaction_service.domain.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import com.yape.transaction_service.domain.model.TransactionTypeModel;
import reactor.core.publisher.Mono;

public interface TransactionTypeRepository extends ReactiveCrudRepository<TransactionTypeModel, Long> {

    Mono<TransactionTypeModel> findByName(String name);

}
