package com.challenge.transaction.core.ports.input;

import com.challenge.transaction.core.domain.model.Transaction;

import java.util.UUID;

public interface GetTransactionUseCase {
    Transaction get(UUID transactionExternalId);
}
