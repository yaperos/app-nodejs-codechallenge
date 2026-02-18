package com.jotace.transaction.application.service;

import com.jotace.transaction.application.port.in.UpdateTransactionStatusUseCase;
import com.jotace.transaction.application.port.out.TransactionRepositoryPort;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateTransactionStatusService implements UpdateTransactionStatusUseCase {

    private static final Logger log = LoggerFactory.getLogger(UpdateTransactionStatusService.class);

    private final TransactionRepositoryPort repository;

    public UpdateTransactionStatusService(TransactionRepositoryPort repository) {
        this.repository = repository;
    }

    @Transactional
    @Override
    public void updateStatus(UUID externalId, String newStatus) {
        repository.updateStatus(externalId, newStatus);
        log.info("Updated transaction for external id {} and status {}", externalId, newStatus);
    }

}
