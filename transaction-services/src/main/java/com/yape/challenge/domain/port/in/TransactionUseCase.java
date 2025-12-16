package com.yape.challenge.domain.port.in;

import com.pe.yape.service.challenge.kafka.avro.ValidateTransactionMessageEvent;
import com.yape.challenge.model.TransactionDetailResponse;
import com.yape.challenge.model.TransactionRequest;
import com.yape.challenge.model.TransactionResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TransactionUseCase {
    Mono<TransactionResponse> createTransaction(TransactionRequest transactionRequest);
    Mono<Void> validateTransaction(ValidateTransactionMessageEvent messageEvent);
    Flux<TransactionDetailResponse> getTransaction(UUID transactionId);
}
