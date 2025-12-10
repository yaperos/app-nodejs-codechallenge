package com.pe.yape.service.challenge.transactions.service;

import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import com.pe.yape.service.challenge.transactions.dto.TransactionRequest;
import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import reactor.core.publisher.Mono;

public interface TransactionService {

    /**
     *
     * @param transactionRequest
     * @return
     */
    Mono<TransactionResponse> create(TransactionRequest transactionRequest);

    /**
     *
     * @param transactionValidatedEvent
     * @return
     */
    Mono<TransactionResponse> update(TransactionValidatedEvent transactionValidatedEvent);

}
