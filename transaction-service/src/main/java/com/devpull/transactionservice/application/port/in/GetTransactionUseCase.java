package com.devpull.transactionservice.application.port.in;

import com.devpull.transactionservice.application.dto.result.TransactionResult;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GetTransactionUseCase {
    Mono<TransactionResult> getById(UUID transactionId);
}
