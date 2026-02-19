package com.yape.yape.application.usecase;

import com.yape.yape.application.dto.UpdateTransactionRequestDto;
import com.yape.yape.application.dto.TransactionResponseDto;
import com.yape.yape.application.mapper.TransactionResponseMapper;
import com.yape.yape.domain.exception.TransactionAlreadyFinalizedException;
import com.yape.yape.domain.exception.TransactionNotFoundException;
import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.model.TransactionStatus;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateTransactionUseCase {

    private final TransactionRepositoryPort repo;

    public UpdateTransactionUseCase(TransactionRepositoryPort repo) {
        this.repo = repo;
    }

    public TransactionResponseDto execute(UUID externalId, UpdateTransactionRequestDto request) {

        Transaction current = repo.findByExternalId(externalId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + externalId));

        if (current.getStatus() != TransactionStatus.APPROVED) {
            throw new TransactionAlreadyFinalizedException(
                    "Transaction cannot be updated once finalized. Current status: " + current.getStatus()
            );
        }

        Transaction updated = new Transaction(
                current.getTransactionExternalId(),
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                current.getTransferTypeId(),
                current.getTransactionType(),
                current.getStatus(),
                request.getValue(),
                current.getCreatedAt()
        );

        Transaction saved = repo.save(updated);

        return TransactionResponseMapper.toDto(saved);
    }
}
