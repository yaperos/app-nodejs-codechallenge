package com.yape.antifraud.application.usecase;

import com.yape.antifraud.domain.model.EventInbound;
import reactor.core.publisher.Mono;

public interface ValidateAntiFraudUseCase {
    Mono<Void> execute(EventInbound message);
}
