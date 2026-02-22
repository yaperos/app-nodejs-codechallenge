package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.Transaction;

public interface CreateTransactionUseCase {

    Transaction execute(CreateTransactionCommand command);
}
