package com.yape.transactionservice.application.abstractions;

import com.yape.transactionservice.application.usecases.createtransaction.CreateTransactionRequest;
import com.yape.transactionservice.application.usecases.createtransaction.CreateTransactionResponse;

public interface CreateTransactionUseCase {
    CreateTransactionResponse execute(CreateTransactionRequest request);
}
