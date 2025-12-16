package com.yape.challenge.application.service;

import com.pe.yape.service.challenge.kafka.avro.ValidateTransactionMessageEvent;
import com.yape.challenge.adapter.out.persistence.model.TransactionValidationRepositoryRequest;
import com.yape.challenge.application.service.mapper.TransactionServiceMapper;
import com.yape.challenge.domain.port.in.TransactionUseCase;
import com.yape.challenge.domain.port.out.TransactionMessagingPort;
import com.yape.challenge.domain.port.out.TransactionRepositoryPort;
import com.yape.challenge.model.TransactionDetailResponse;
import com.yape.challenge.model.TransactionRequest;
import com.yape.challenge.model.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService implements TransactionUseCase {
    private final TransactionRepositoryPort transactionRepositoryPort;
    private final TransactionServiceMapper transactionServiceMapper;
    private final TransactionMessagingPort transactionMessagingPort;

    @Override
    public Mono<TransactionResponse> createTransaction(TransactionRequest transactionRequest) {
        return transactionRepositoryPort.save(transactionServiceMapper
                        .toMapRepositoryRequest(transactionRequest))
                .flatMap(response ->
                    transactionMessagingPort.sendTransactionEvent(
                                    transactionServiceMapper.toMapCreateEvent(transactionRequest, response))
                            .thenReturn(transactionServiceMapper.toMapResponse(response))
                );
    }

    @Override
    public Mono<Void> validateTransaction(ValidateTransactionMessageEvent messageEvent) {
        return transactionRepositoryPort.update(TransactionValidationRepositoryRequest.builder()
                        .transactionId(UUID.fromString(messageEvent.getTransactionId().toString()))
                        .status(messageEvent.getStatus().toString())
                .build());
    }

    @Override
    public Flux<TransactionDetailResponse> getTransaction(UUID transactionId) {
        return transactionRepositoryPort.getTransaction(transactionId)
                .map(transactionServiceMapper::toGetTransactions);
    }
}
