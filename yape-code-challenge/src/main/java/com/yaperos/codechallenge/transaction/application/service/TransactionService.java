package com.yaperos.codechallenge.transaction.application.service;

import com.yaperos.codechallenge.shared.event.TransactionStatusType;
import com.yaperos.codechallenge.transaction.domain.exception.TransactionNotFoundException;
import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.model.TransferType;
import com.yaperos.codechallenge.transaction.domain.port.input.CreateTransactionUseCase;
import com.yaperos.codechallenge.transaction.domain.port.input.GetTransactionUseCase;
import com.yaperos.codechallenge.transaction.domain.port.input.UpdateTransactionStatusUseCase;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionEventPublisherPort;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService implements CreateTransactionUseCase, GetTransactionUseCase, UpdateTransactionStatusUseCase {

    private final TransactionRepositoryPort transactionRepository;
    private final TransactionEventPublisherPort eventPublisher;

    @Override
    @Transactional
    public Transaction create(UUID accountExternalIdDebit,
                              UUID accountExternalIdCredit,
                              TransferType transferType,
                              BigDecimal value) {
        Transaction transaction = Transaction.create(accountExternalIdDebit, accountExternalIdCredit, transferType, value);
        Transaction saved = transactionRepository.save(transaction);
        eventPublisher.publishTransactionCreated(saved);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "transactions", key = "#transactionExternalId")
    public Transaction getById(UUID transactionExternalId) {
        return transactionRepository.findById(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));
    }

    @Override
    @Transactional
    @CacheEvict(value = "transactions", key = "#transactionExternalId")
    public void updateStatus(UUID transactionExternalId, TransactionStatusType status) {
        Transaction transaction = transactionRepository.findById(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));

        switch (status) {
            case APPROVED -> transaction.approve();
            case REJECTED -> transaction.reject();
        }

        transactionRepository.save(transaction);
    }

}
