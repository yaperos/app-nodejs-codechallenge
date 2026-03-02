package com.yape.transaction.application.usecase;

import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import reactor.core.publisher.Mono;

public interface CreateTransactionUseCase {
    Mono<CreateTransactionResponse> execute(CreateTransactionRequest createTransactionRequest);
}
