package com.devpull.transactionservice.application.usecase;

import com.devpull.transactionservice.application.dto.result.TransactionResult;
import com.devpull.transactionservice.application.port.in.GetTransactionUseCase;
import com.devpull.transactionservice.application.port.out.TransactionRepositoryPort;
import com.devpull.transactionservice.domain.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class GetTransactionService implements GetTransactionUseCase {

    private final TransactionRepositoryPort txPort;

    public GetTransactionService(TransactionRepositoryPort txPort) {
        this.txPort = txPort;
    }

    @Override
    public Mono<TransactionResult> getById(UUID transactionId) {
        return txPort.findById(transactionId)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("Transaction", "id", transactionId)))
                .map(tx -> new TransactionResult(
                        tx.getId(),
                        tx.getStatus(),
                        tx.getType(),
                        tx.getAmount(),
                        tx.getCreatedAt(),
                        tx.getUpdatedAt(),
                        tx.getAccountId()
                ));
    }
}
