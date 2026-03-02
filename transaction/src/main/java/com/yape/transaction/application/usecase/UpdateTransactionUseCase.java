package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.EventInbound;
import reactor.core.publisher.Mono;

public interface UpdateTransactionUseCase {
    Mono<Void> execute(EventInbound message);
}
