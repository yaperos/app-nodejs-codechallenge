package com.challenge.transaction.core.ports.input;

import com.challenge.transaction.core.domain.model.Transaction;

public interface CreateTransactionUseCase {
    Transaction create(Transaction transaction);
}
