package com.yape.transaction.application.service;

import com.yape.transaction.application.dto.GetTransactionResponse;
import com.yape.transaction.application.mapper.TransactionMapper;
import com.yape.transaction.application.usecase.GetTransactionUseCase;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GetTransactionService implements GetTransactionUseCase {

    private static final Logger logger = LoggerFactory.getLogger(GetTransactionService.class);

    private final TransactionRepositoryPort transactionRepositoryPort;

    @Override
    public Mono<GetTransactionResponse> execute(String transactionExternalId) {
        return transactionRepositoryPort.findById(transactionExternalId)
                .switchIfEmpty(Mono.defer(() -> {
                    logger.warn("Transaction with ID: {} not found", transactionExternalId);
                    return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Transaction with ID: " + transactionExternalId + " not found"));
                }))
                .map(TransactionMapper::toGetResponse);
    }
}
