package com.yape.transaction.application.service;

import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusCommand;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateTransactionStatusService implements UpdateTransactionStatusUseCase {

    private static final Logger log = LoggerFactory.getLogger(UpdateTransactionStatusService.class);

    private final TransactionRepository repository;

    public UpdateTransactionStatusService(TransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void execute(UpdateTransactionStatusCommand command) {
        Transaction transaction = repository.findById(command.transactionId())
                .orElseThrow(() -> new TransactionNotFoundException(command.transactionId()));

        if (!transaction.isPending()) {
            log.warn("event=transaction.status_update_skipped, transactionId={}, currentStatus={}, requestedStatus={}, outcome=skipped",
                    command.transactionId(), transaction.getStatus(), command.newStatus());
            return;
        }

        switch (command.newStatus()) {
            case APPROVED -> transaction.approve();
            case REJECTED -> transaction.reject();
            default -> throw new IllegalArgumentException("Invalid status update: " + command.newStatus());
        }

        repository.save(transaction);
        log.info("event=transaction.status_updated, transactionId={}, status={}, outcome=success",
                command.transactionId(), transaction.getStatus());
    }
}
