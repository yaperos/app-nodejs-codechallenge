package com.yape.transaction.application.usecase;

import com.yape.transaction.application.dto.GetTransactionResponse;
import reactor.core.publisher.Mono;

public interface GetTransactionUseCase {
    Mono<GetTransactionResponse> execute(String transactionExternalId);
}
