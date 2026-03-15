package com.challenge.transaction.core.usecase;

import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.input.GetTransactionUseCase;
import com.challenge.transaction.core.ports.output.TransactionRepository;
import lombok.AllArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
public class GetTransactionService implements GetTransactionUseCase {
    private final TransactionRepository repository;

    @Override
    public Transaction get(UUID transactionExternalId) {
        return repository.findByExternalId(transactionExternalId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

}
