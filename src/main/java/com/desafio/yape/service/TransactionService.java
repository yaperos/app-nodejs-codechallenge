package com.desafio.yape.service;

import com.desafio.yape.dto.CreateTransactionRequest;
import com.desafio.yape.model.Transaction;

public interface TransactionService {
    Transaction create(CreateTransactionRequest req);

    Transaction findByExternalId(String externalId);
}
