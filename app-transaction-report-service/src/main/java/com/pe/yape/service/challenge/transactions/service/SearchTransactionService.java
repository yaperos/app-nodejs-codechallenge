package com.pe.yape.service.challenge.transactions.service;

import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import reactor.core.publisher.Mono;

public interface SearchTransactionService {

    /**
     *
     * @param transactionId
     * @return
     */
    Mono<TransactionResponse> search(String transactionId);

}
