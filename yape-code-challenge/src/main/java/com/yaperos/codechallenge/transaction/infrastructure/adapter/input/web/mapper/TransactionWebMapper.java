package com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.mapper;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.TransactionResponse;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.TransactionStatusDto;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.TransactionTypeDto;
import org.springframework.stereotype.Component;

@Component
public class TransactionWebMapper {

    public TransactionResponse toResponse(Transaction domain) {
        return new TransactionResponse(
                domain.getTransactionExternalId(),
                new TransactionTypeDto(domain.getTransferType().getName()),
                new TransactionStatusDto(domain.getStatus().name().toLowerCase()),
                domain.getValue(),
                domain.getCreatedAt()
        );
    }

}
