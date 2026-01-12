package com.msucre.transaction.domain.service;


import com.msucre.shared.model.dto.event.TransactionEventDto;
import com.msucre.shared.model.dto.event.TransactionEventResponseDto;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface EventService {

  Mono<Void> sendTransactionEvent(TransactionEventDto transactionEventDto);

  Flux<TransactionEventResponseDto> consumeTransactionEventResponses();
}
