package com.yape.challenge.domain.port.out;

import com.yape.challenge.domain.model.ValidateTransactionEvent;
import reactor.core.publisher.Mono;

public interface AntiFraudProducerPort {
    Mono<Void> sendValidationResult(ValidateTransactionEvent status);
}
