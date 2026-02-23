package com.kafka.productor.application.usecase.service.update;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.kafka.productor.domain.port.TransactionCachePort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateTransactionStatusService implements UpdateTransactionStatusUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final TransactionCachePort transactionCachePort;

    @Override
    public void execute(UUID transactionExternalId, String status) {
        transactionRepositoryPort.updateStatus(transactionExternalId, status);
        transactionCachePort.delete(transactionExternalId);
    }
    
}
