package com.yape.transactions.service;

import com.yape.transactions.dto.CreateTransactionRequest;
import com.yape.transactions.dto.TransactionResponse;

import java.util.UUID;

public interface TransactionService {

    TransactionResponse createTransactionEvent(CreateTransactionRequest createTransactionRequest);

    TransactionResponse readTransaction(UUID transactionExternalId);
}
