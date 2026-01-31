package com.yape.transaction_service.domain.repository;

import java.util.UUID;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import com.yape.transaction_service.domain.model.TransactionModel;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface TransactionRepository extends ReactiveCrudRepository<TransactionModel, UUID> {

    Mono<TransactionModel> findByTransactionExternalId(UUID transactionExternalId);

}
