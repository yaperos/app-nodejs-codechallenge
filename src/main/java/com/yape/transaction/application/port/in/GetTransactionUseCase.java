package com.yape.transaction.application.port.in;

import com.yape.transaction.domain.model.Transaction;

import java.util.UUID;

public interface GetTransactionUseCase {
    Transaction getTransaction(UUID transactionExternalId);
}
