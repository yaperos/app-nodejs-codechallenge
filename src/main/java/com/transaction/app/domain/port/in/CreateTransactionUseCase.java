package com.transaction.app.domain.port.in;

import com.transaction.app.domain.model.TransactionModel;

public interface CreateTransactionUseCase {
    TransactionModel create(TransactionModel model);
}
