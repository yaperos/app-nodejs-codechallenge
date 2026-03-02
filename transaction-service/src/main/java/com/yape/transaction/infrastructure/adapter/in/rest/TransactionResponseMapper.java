package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransferType;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse.TransactionStatusDto;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse.TransactionTypeDto;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TransactionResponseMapper {

    public TransactionResponse toResponse(Transaction transaction) {
        String typeName = getTransferTypeName(transaction.getTransferTypeId());
        
        return new TransactionResponse(
                transaction.getTransactionExternalId(),
                new TransactionTypeDto(typeName),
                new TransactionStatusDto(transaction.getStatus().getName()),
                transaction.getValue(),
                transaction.getCreatedAt()
        );
    }

    private String getTransferTypeName(Integer transferTypeId) {
        try {
            return TransferType.fromId(transferTypeId).getName();
        } catch (IllegalArgumentException e) {
            return "Unknown";
        }
    }
}
