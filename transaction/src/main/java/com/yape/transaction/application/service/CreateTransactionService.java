package com.yape.transaction.application.service;

import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import com.yape.transaction.application.mapper.TransactionMapper;
import com.yape.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.transaction.domain.enums.TransactionType;
import com.yape.transaction.domain.ports.KafkaProducerPort;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreateTransactionService implements CreateTransactionUseCase {

    private static final Logger logger = LoggerFactory.getLogger(CreateTransactionService.class);

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final KafkaProducerPort kafkaProducerPort;

    @Override
    public Mono<CreateTransactionResponse> execute(CreateTransactionRequest request) {
        logger.info("Creating a new transaction");

        return Mono.just(request.getTranferTypeId())
            .map(this::validateTransactionType)
            .flatMap(transactionType -> transactionRepositoryPort.save(
                TransactionMapper.toEntity(request, transactionType)
            ))
            .doOnNext(saved -> logger.info("Transaction created: {}", saved.getTransactionExternalId()))
            .flatMap(saved -> kafkaProducerPort.sendValidate(TransactionMapper.toEventOutbound(saved))
                    .thenReturn(TransactionMapper.toCreateResponse(saved)));
    }

    private TransactionType validateTransactionType(Integer transferTypeId) {
        return Arrays.stream(TransactionType.values())
            .filter(type -> type.getValue() == transferTypeId)
            .findFirst()
            .orElseThrow(() -> {
                String validTypes = Arrays.stream(TransactionType.values())
                    .map(type -> type.getValue() + " = " + type.name())
                    .collect(Collectors.joining(", "));
                return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid transaction type: " + transferTypeId + ". Valid types are: " + validTypes);
            });
    }
}
