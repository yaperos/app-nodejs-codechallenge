package com.yaperos.codechallenge.transaction.domain.port.input;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;

import java.util.UUID;

public interface GetTransactionUseCase {

    Transaction getById(UUID transactionExternalId);

}
