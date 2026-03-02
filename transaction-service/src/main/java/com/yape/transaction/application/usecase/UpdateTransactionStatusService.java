package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateTransactionStatusService implements UpdateTransactionStatusUseCase {

    private final TransactionRepository transactionRepository;

    public UpdateTransactionStatusService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public void execute(Command command) {
        Transaction transaction = transactionRepository
                .findByTransactionExternalId(command.transactionExternalId())
                .orElseThrow(() -> new TransactionNotFoundException(command.transactionExternalId()));

        if (TransactionStatus.APPROVED.equals(command.newStatus())) {
            transaction.approve();
        } else {
            transaction.reject();
        }

        transactionRepository.update(transaction);
    }
}
