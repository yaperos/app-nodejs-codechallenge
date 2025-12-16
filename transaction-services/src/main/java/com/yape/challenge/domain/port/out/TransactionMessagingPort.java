package com.yape.challenge.domain.port.out;

import com.yape.challenge.domain.model.CreateTransactionEvent;
import reactor.core.publisher.Mono;

public interface TransactionMessagingPort {
    Mono<Void> sendTransactionEvent(CreateTransactionEvent event);


}
