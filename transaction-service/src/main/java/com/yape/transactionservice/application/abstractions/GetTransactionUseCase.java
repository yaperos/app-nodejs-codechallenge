package com.yape.transactionservice.application.abstractions;

import com.yape.transactionservice.application.usecases.gettransaction.GetTransactionRequest;
import com.yape.transactionservice.application.usecases.gettransaction.GetTransactionResponse;

import java.util.List;

public interface GetTransactionUseCase {
    List<GetTransactionResponse> execute(GetTransactionRequest request);
}
