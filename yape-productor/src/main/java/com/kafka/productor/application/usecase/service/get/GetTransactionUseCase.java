package com.kafka.productor.application.usecase.service.get;

import java.util.Optional;
import java.util.UUID;

import com.kafka.productor.domain.model.Transaction;

public interface GetTransactionUseCase {
    Optional<Transaction> execute(UUID transactionExternalId);
}
