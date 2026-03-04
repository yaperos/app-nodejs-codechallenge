package com.yape.business.financial.infrastructure.events;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Component
public class TransactionEventBus {
    private final Sinks.Many<TransactionEvent> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publish(TransactionEvent event) {
        sink.tryEmitNext(event);
    }

    public Flux<TransactionEvent> asFlux() {
        return sink.asFlux();
    }
}
