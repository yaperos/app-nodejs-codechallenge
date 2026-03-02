package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetTransactionService implements GetTransactionUseCase {

    private final TransactionRepository transactionRepository;

    public GetTransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Transaction execute(UUID transactionExternalId) {
        return transactionRepository.findByTransactionExternalId(transactionExternalId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionExternalId));
    }
}
