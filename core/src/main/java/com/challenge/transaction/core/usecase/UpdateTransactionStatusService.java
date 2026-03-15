package com.challenge.transaction.core.usecase;

import com.challenge.transaction.core.ports.output.TransactionRepository;
import lombok.AllArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
public class UpdateTransactionStatusService {

    private final TransactionRepository repository;

    public void updateStatus(UUID transactionId, String status) {
        repository.updateStatus(transactionId, status);
    }
}
