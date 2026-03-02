package com.yape.transactionservice.service;

import com.yape.transactionservice.dto.request.CreateTransactionRequest;
import com.yape.transactionservice.dto.response.TransactionResponse;
import com.yape.transactionservice.dto.response.ValidateAntiFraudTransactionResponse;

import java.math.BigInteger;

public interface TransactionService {

    public TransactionResponse getTransaction(BigInteger id);
    public TransactionResponse saveTransaction(CreateTransactionRequest request);
    public ValidateAntiFraudTransactionResponse validateTransaction(BigInteger id);

}
