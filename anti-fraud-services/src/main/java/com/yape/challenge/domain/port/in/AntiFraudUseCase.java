package com.yape.challenge.domain.port.in;


import com.pe.yape.service.challenge.kafka.avro.CreatedTransactionMessageEvent;
import reactor.core.publisher.Mono;

public interface AntiFraudUseCase {
    Mono<Void> validate(CreatedTransactionMessageEvent transaction);
}
