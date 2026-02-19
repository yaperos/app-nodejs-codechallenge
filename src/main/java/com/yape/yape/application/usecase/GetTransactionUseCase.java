package com.yape.yape.application.usecase;

import com.yape.yape.application.dto.TransactionResponseDto;
import com.yape.yape.application.mapper.TransactionResponseMapper;
import com.yape.yape.domain.exception.TransactionNotFoundException;
import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetTransactionUseCase {

    private final TransactionRepositoryPort repo;

    public GetTransactionUseCase(TransactionRepositoryPort repo) {
        this.repo = repo;
    }

    public TransactionResponseDto execute(UUID externalId) {
        Transaction tx = repo.findByExternalId(externalId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + externalId));

        return TransactionResponseMapper.toDto(tx);
    }
}
