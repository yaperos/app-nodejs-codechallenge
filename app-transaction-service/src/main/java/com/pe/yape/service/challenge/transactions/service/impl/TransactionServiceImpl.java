package com.pe.yape.service.challenge.transactions.service.impl;

import com.pe.yape.service.challenge.transactions.avro.TransactionValidatedEvent;
import com.pe.yape.service.challenge.transactions.domain.model.Transaction;
import com.pe.yape.service.challenge.transactions.domain.model.TransactionStatus;
import com.pe.yape.service.challenge.transactions.dto.TransactionRequest;
import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import com.pe.yape.service.challenge.transactions.messaging.TransactionCreatedProducer;
import com.pe.yape.service.challenge.transactions.repository.TransactionRepository;
import com.pe.yape.service.challenge.transactions.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

@Slf4j
@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionCreatedProducer transactionCreatedProducer;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  TransactionCreatedProducer transactionCreatedProducer) {
        this.transactionRepository = transactionRepository;
        this.transactionCreatedProducer = transactionCreatedProducer;
    }

    public Mono<TransactionResponse> create(TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .accountExternalIdCredit(UUID.fromString(request.getAccountExternalIdCredit()))
                .accountExternalIdDebit(UUID.fromString(request.getAccountExternalIdDebit()))
                .transferTypeId(request.getTransferTypeId())
                .value(request.getValue())
                .status(TransactionStatus.PENDING.toString())
                .createdAt(OffsetDateTime.now())
                .build();

        return transactionRepository.save(transaction)
                .flatMap(transactionCreated -> transactionCreatedProducer.publish(transactionCreated)
                        .thenReturn(transactionCreated))
                .map(saved -> TransactionResponse.builder()
                        .transactionExternalId(saved.getTransactionExternalId().toString())
                        .build()
                )
                .doOnSuccess(transactionResponse -> log.info("Transaction created and published: {}", transactionResponse.getTransactionExternalId()))
                .doOnError(error -> log.error("Error creating transaction or publishing event", error));
    }


    @Override
    public Mono<TransactionResponse> update(TransactionValidatedEvent event) {

        return transactionRepository.findById(UUID.fromString(event.getTransactionExternalId().toString()))
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Transaction not found")))
                .flatMap(existingTransaction -> {
                    existingTransaction.setStatus(event.getStatus().toString());
                    existingTransaction.setUpdatedAt(OffsetDateTime.now());
                    return transactionRepository.save(existingTransaction);
                })
                .map(updated -> TransactionResponse.builder()
                        .transactionExternalId(updated.getTransactionExternalId().toString())
                        .build()
                )
                .doOnSuccess(transactionResponse -> log.info("Transaction {} updated ", transactionResponse.getTransactionExternalId()))
                .doOnError(error -> log.error("Error updating transaction or publishing event", error));
    }

}
