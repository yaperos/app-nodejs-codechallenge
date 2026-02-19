package com.yape.yape.application.usecase;

import com.yape.yape.domain.exception.TransactionNotFoundException;
import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.model.TransactionStatus;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateTransactionStatusUseCase {

    private final TransactionRepositoryPort repo;

    public UpdateTransactionStatusUseCase(TransactionRepositoryPort repo) {
        this.repo = repo;
    }

    public void execute(UUID externalId, TransactionStatus newStatus) {

        Transaction current = repo.findByExternalId(externalId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + externalId));

        if (current.getStatus() == TransactionStatus.APPROVED || current.getStatus() == TransactionStatus.REJECTED) {
            return;
        }

        Transaction updated = new Transaction(
                current.getTransactionExternalId(),
                current.getAccountExternalIdDebit(),
                current.getAccountExternalIdCredit(),
                current.getTransferTypeId(),
                current.getTransactionType(),
                newStatus,
                current.getValue(),
                current.getCreatedAt()
        );

        repo.save(updated);
    }
}
