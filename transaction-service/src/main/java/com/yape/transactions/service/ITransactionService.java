package com.yape.transactions.service;

import com.yape.transactions.dto.request.TransactionRequest;
import com.yape.transactions.dto.response.TransactionResponse;
import com.yape.transactions.model.TransactionStatus;

import java.util.UUID;

public interface ITransactionService {
    TransactionResponse create(TransactionRequest transaction);
    TransactionResponse getById(UUID id);
    void updateStatus(UUID id, TransactionStatus status);
}
