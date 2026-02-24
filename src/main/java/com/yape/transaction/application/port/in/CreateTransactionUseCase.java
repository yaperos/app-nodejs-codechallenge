package com.yape.transaction.application.port.in;

import com.yape.transaction.domain.model.Transaction;

public interface CreateTransactionUseCase {
    Transaction createTransaction(Transaction transaction);
}
