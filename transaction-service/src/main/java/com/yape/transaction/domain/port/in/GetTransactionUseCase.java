package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.Transaction;

import java.util.UUID;

public interface GetTransactionUseCase {

    Transaction execute(UUID transactionId);
}
