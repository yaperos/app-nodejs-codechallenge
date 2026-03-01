package com.yape.transactionservice.application.abstractions;

import com.yape.transactionservice.application.usecases.getbyidtransaction.GetByIdTransactionRequest;
import com.yape.transactionservice.application.usecases.getbyidtransaction.GetByIdTransactionResponse;

import java.util.Optional;

public interface GetByIdTransactionUseCase {

    GetByIdTransactionResponse execute(GetByIdTransactionRequest request);
}
