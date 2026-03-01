package com.retotecnico.transaction.application.service;

import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.model.TransactionStatus;
import com.retotecnico.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.retotecnico.transaction.domain.port.out.TransactionCacheRepository;
import com.retotecnico.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UpdateTransactionStatusService implements UpdateTransactionStatusUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionCacheRepository transactionCacheRepository;

    @Override
    @Transactional
    public void execute(UUID transactionExternalId, String status) {
        Transaction transaction = transactionRepository.findById(transactionExternalId)
                .orElseThrow(() -> new RuntimeException(
                        "Transaction not found: " + transactionExternalId));

        // Update domain entity status
        TransactionStatus newStatus = TransactionStatus.valueOf(status.toUpperCase());
        if (newStatus == TransactionStatus.APPROVED) {
            transaction.approve();
        } else if (newStatus == TransactionStatus.REJECTED) {
            transaction.reject();
        }

        // Update in PostgreSQL (Write model)
        transactionRepository.save(transaction);
        log.info("Transaction {} status updated to {}", transactionExternalId, status);

        // Update in Redis (Read model - CQRS)
        transactionCacheRepository.save(transaction);
    }
}
