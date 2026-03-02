package com.codeh.transaction_service.service;

import com.codeh.transaction_service.dto.request.CreateTransactionRequest;
import com.codeh.transaction_service.dto.response.TransactionResponse;
import com.codeh.transaction_service.mapper.TransactionMapper;
import com.codeh.transaction_service.model.Transaction;
import com.codeh.transaction_service.model.TransactionStatus;
import com.codeh.transaction_service.model.TransactionType;
import com.codeh.transaction_service.messaging.publisher.TransactionEventPublisher;
import com.codeh.transaction_service.messaging.event.TransactionCreatedEvent;
import com.codeh.transaction_service.repository.TransactionRepository;
import com.codeh.transaction_service.repository.TransactionStatusRepository;
import com.codeh.transaction_service.repository.TransactionTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionStatusRepository statusRepository;
    private final TransactionTypeRepository typeRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionEventPublisher transactionEventPublisher;


    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {

        TransactionType type = typeRepository.findById(request.getTransferTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Transaction type not found"));

        TransactionStatus pendingStatus = statusRepository.findByName("PENDING")
                .orElseThrow(() -> new EntityNotFoundException("Status not found"));

        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
        transaction.setAccountExternalIdCredit(request.getAccountExternalIdCredit());
        transaction.setTransactionType(type);
        transaction.setStatus(pendingStatus);
        transaction.setValue(request.getValue());
        transaction.setCreatedAt(LocalDateTime.now());
        Transaction save = transactionRepository.save(transaction);
        transactionEventPublisher.publishTransactionCreated(new TransactionCreatedEvent(save.getTransactionExternalId(),save.getValue()));
        return transactionMapper.mapToResponse(save);
    }

    @Transactional
    public TransactionResponse getByExternalId(UUID externalId) {
        return transactionMapper.mapToResponse(
                transactionRepository.findByTransactionExternalId(externalId)
                        .orElseThrow(() -> new EntityNotFoundException("Transaction not found"))
        );
    }
}
