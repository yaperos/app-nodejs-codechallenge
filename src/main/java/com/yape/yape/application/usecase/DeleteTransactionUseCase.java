package com.yape.yape.application.usecase;

import com.yape.yape.domain.exception.TransactionNotFoundException;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteTransactionUseCase {

    private final TransactionRepositoryPort repo;

    public DeleteTransactionUseCase(TransactionRepositoryPort repo) {
        this.repo = repo;
    }

    public void execute(UUID externalId) {
        if (!repo.existsByExternalId(externalId)) {
            throw new TransactionNotFoundException("Transaction not found: " + externalId);
        }
        repo.deleteByExternalId(externalId);
    }
}
