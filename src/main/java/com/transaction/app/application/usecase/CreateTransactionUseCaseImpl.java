package com.transaction.app.application.usecase;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.model.TransactionStatus;
import com.transaction.app.domain.port.in.CreateTransactionUseCase;
import com.transaction.app.domain.port.out.TransactionEventPublisherPort;
import com.transaction.app.domain.port.out.TransactionRepositoryPort;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@AllArgsConstructor
public class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {

    private final TransactionRepositoryPort repository;
    private final TransactionEventPublisherPort publisher;

    @Override
    public TransactionModel create(TransactionModel model) {
        model.setTransactionExternalId(UUID.randomUUID());
        model.setStatus(TransactionStatus.PENDING);
        model.setCreatedAt(LocalDateTime.now());
        TransactionModel saved = repository.save(model);
        publisher.publish(saved);
        return saved;
    }
}
