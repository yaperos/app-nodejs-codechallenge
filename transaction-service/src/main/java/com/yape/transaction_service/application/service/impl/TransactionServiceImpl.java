package com.yape.transaction_service.application.service.impl;

import java.util.UUID;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.yape.transaction_service.application.dto.CreateTransactionRequest;
import com.yape.transaction_service.application.dto.TransactionResponse;
import com.yape.transaction_service.application.mapper.TransactionMapper;
import com.yape.transaction_service.application.service.TransactionService;
import com.yape.transaction_service.domain.model.TransactionModel;
import com.yape.transaction_service.domain.repository.TransactionRepository;
import com.yape.transaction_service.domain.repository.TransactionStatusRepository;
import com.yape.transaction_service.domain.repository.TransactionTypeRepository;
import com.yape.transaction_service.domain.event.TransactionCreatedEvent;
import com.yape.transaction_service.infrastructure.messaging.producer.TransactionProducer;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionStatusRepository statusRepository;
    private final TransactionTypeRepository typeRepository;
    private final TransactionProducer transactionProducer;
    @Override
    public Mono<TransactionResponse> create(CreateTransactionRequest request) {
        log.info("Iniciando creación de transacción para cuenta débito: {} y cuenta crédito: {}",
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit());

        return statusRepository.findByName("PENDING")
                .switchIfEmpty(Mono.error(new IllegalStateException("PENDING status not found")))
                .flatMap(status -> {
                    log.info("Status encontrado: {} - {}", status.getId(), status.getName());
                    TransactionModel entity = TransactionMapper.toEntity(request);
                    return transactionRepository.save(entity)
                            .doOnNext(saved -> log.info("Guardado: {}", saved))
                            .doOnError(error -> log.error("Error guardando la transacción", error));
                    })
                .flatMap(saved ->
                        buildResponse(saved)
                                .flatMap(response ->
                                        Mono.fromRunnable(() -> transactionProducer.send(
                                                new TransactionCreatedEvent(
                                                        saved.getTransactionExternalId(),
                                                        saved.getValue())
                                        )).thenReturn(response)
                                )
                )
                .doOnError(error -> log.error("❌ Error creando transacción", error));
    }

    @Override
        public Mono<TransactionResponse> getByExternalId(UUID externalId) {
                return transactionRepository.findByTransactionExternalId(externalId)
                                .switchIfEmpty(Mono.error(new IllegalArgumentException("Transaction not found")))
                                .flatMap(this::buildResponse);
        }

    private Mono<TransactionResponse> buildResponse(TransactionModel transaction) {
        return typeRepository.findById(Long.valueOf(transaction.getTransferTypeId()))
                .map(type -> TransactionMapper.toResponse(transaction, type));
    }

}
