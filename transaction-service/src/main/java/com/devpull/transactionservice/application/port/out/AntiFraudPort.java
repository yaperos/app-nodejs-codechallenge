package com.devpull.transactionservice.application.port.out;

import com.devpull.transactionservice.domain.model.Transaction;
import reactor.core.publisher.Mono;

public interface AntiFraudPort {

    Mono<String> send(Transaction tx);

}
