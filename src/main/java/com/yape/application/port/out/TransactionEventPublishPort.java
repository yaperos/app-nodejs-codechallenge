package com.yape.application.port.out;

import com.yape.domain.model.Transaction;

import reactor.core.publisher.Mono;
import reactor.kafka.sender.SenderResult;

public interface TransactionEventPublishPort {
    Mono<SenderResult<Void>> publishTransactionCreated(Transaction transaction);
}
