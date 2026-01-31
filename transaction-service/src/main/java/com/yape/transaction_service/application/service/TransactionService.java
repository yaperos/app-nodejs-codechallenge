package com.yape.transaction_service.application.service;

import java.util.UUID;

import com.yape.transaction_service.application.dto.CreateTransactionRequest;
import com.yape.transaction_service.application.dto.TransactionResponse;

import reactor.core.publisher.Mono;

public interface TransactionService {

    Mono<TransactionResponse> create(CreateTransactionRequest request);

    Mono<TransactionResponse> getByExternalId(UUID transactionExternalId);

}
