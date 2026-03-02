package com.codeh.transaction_service.mapper;

import com.codeh.transaction_service.dto.response.TransactionResponse;
import com.codeh.transaction_service.model.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .transactionType(
                        TransactionResponse.TransactionTypeResponse.builder()
                                .name(transaction.getTransactionType().getName())
                                .build()
                )
                .transactionStatus(
                        TransactionResponse.TransactionStatusResponse.builder()
                                .name(transaction.getStatus().getName())
                                .build()
                )
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
