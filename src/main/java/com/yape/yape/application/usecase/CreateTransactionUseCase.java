package com.yape.yape.application.usecase;

import com.yape.yape.application.dto.CreateTransactionRequestDto;
import com.yape.yape.application.dto.TransactionCreatedEvent;
import com.yape.yape.application.dto.TransactionResponseDto;
import com.yape.yape.application.mapper.TransactionResponseMapper;
import com.yape.yape.domain.model.Transaction;
import com.yape.yape.domain.model.TransactionStatus;
import com.yape.yape.domain.model.TransactionType;
import com.yape.yape.domain.port.EventPublisherPort;
import com.yape.yape.domain.port.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class CreateTransactionUseCase {

    private final TransactionRepositoryPort repo;
    private final EventPublisherPort publisher;

    public CreateTransactionUseCase(TransactionRepositoryPort repo, EventPublisherPort publisher) {
        this.repo = repo;
        this.publisher = publisher;
    }

    public TransactionResponseDto execute(CreateTransactionRequestDto request) {

        UUID id = UUID.randomUUID();

        TransactionType type = TransactionType.TRANSFER;

        Transaction tx = new Transaction(
                id,
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getTranferTypeId(),
                type,
                TransactionStatus.PENDING, // SIEMPRE PENDING al crear
                request.getValue(),
                Instant.now()
        );

        Transaction saved = repo.save(tx);

        // evento para antifraud
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(saved.getTransactionExternalId())
                .accountExternalIdDebit(saved.getAccountExternalIdDebit())
                .accountExternalIdCredit(saved.getAccountExternalIdCredit())
                .tranferTypeId(saved.getTransferTypeId())
                .value(saved.getValue())
                .createdAt(saved.getCreatedAt())
                .build();

        publisher.publishTransactionCreated(event);

        return TransactionResponseMapper.toDto(saved);
    }
}
