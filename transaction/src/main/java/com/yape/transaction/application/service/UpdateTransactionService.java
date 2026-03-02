package com.yape.transaction.application.service;

import com.yape.transaction.domain.model.EventInbound;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import com.yape.transaction.application.usecase.UpdateTransactionUseCase;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UpdateTransactionService implements UpdateTransactionUseCase {

    private static final Logger logger = LoggerFactory.getLogger(UpdateTransactionService.class);

    private final TransactionRepositoryPort transactionRepositoryPort;

    @Override
    public Mono<Void> execute(EventInbound message) {
        logger.info("Updating status with id: {}", message.getTransactionExternalId());
        return transactionRepositoryPort.updateStatus(message.getTransactionExternalId(), message.getStatus())
                .then();
    }
}
