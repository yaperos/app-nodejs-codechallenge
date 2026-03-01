package com.retotecnico.transaction.domain.port.in;

import com.retotecnico.transaction.domain.model.Transaction;

import java.util.UUID;

/**
 * Input port - use case for retrieving a transaction.
 */
public interface GetTransactionUseCase {

    Transaction execute(UUID transactionExternalId);
}
